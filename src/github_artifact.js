const artifact = require('@actions/artifact');
const github = require('@actions/github');
const admzip = require("adm-zip");

const path = require('path');
const fs = require('fs');

var artifactClient;
var octokitClient;

function getArtifactClient() {
    artifactClient = artifactClient || artifact.create();

    return artifactClient;
}

/**
 * @param {string} token
 */
function getOctokitClient(token) {
    octokitClient = octokitClient || github.getOctokit(token);

    return octokitClient;
}

/**
 * @param {string} name 
 * @param {string} file 
 * @param {number} retentionDays // 0 means default value set in github
 */
exports.upload = async function (name, file, retentionDays = 0) {
    if (!fs.existsSync(file)) {
        throw new Error(`Artifact Upload failed: ${name} - File does not exist: ${file}`);
    }

    const uploadResponse = await getArtifactClient().uploadArtifact(
        name, [file], path.dirname(file), { retentionDays: retentionDays }
    );

    // there is a failed item
    if (uploadResponse.failedItems.length > 0) {
        throw new Error(`Artifact Upload failed: ${name}`);
    }

    return name;
}

/**
 * @param {string} name 
 * @param {string} basedir 
 */
exports.download = async function (name, basedir) {
    if (!fs.existsSync(basedir)) {
        throw new Error(`Artifact Download failed: ${name} - Directory does not exist: ${basedir}`);
    }

    const downloadResponse = await getArtifactClient().downloadArtifact(name, basedir);

    return downloadResponse.downloadPath;
}

/**
 * @param {string} name
 * @param {string} basedir
 * @param {string} owner
 * @param {string} repo
 * @param {string} workflow
 * @param {string} token
 */
exports.downloadFromWorkflow = async function (name, basedir, owner, repo, workflow, token) {
    const octokit = getOctokitClient(token);

    const { data: workflowRuns } = await octokit.rest.actions.listWorkflowRunsForRepo({ owner, repo });
    const workflowRunIds = workflowRuns.workflow_runs
        .filter(workflowRun => workflowRun.name == workflow.trim())
        .map(workflowRun => workflowRun.id);

    if (workflowRunIds.length == 0) {
        throw new Error(`No workflow: ${workflow} or workflow runs for it found`);
    }

    const latestWorkflowRunId = workflowRunIds.sort().pop();
    const { data: { artifacts } } = await octokit.rest.actions.listWorkflowRunArtifacts({
        owner, repo, run_id: latestWorkflowRunId
    });

    const matchingArtifacts = artifacts.filter(artifact => artifact.name == name.trim());
    if (matchingArtifacts.length == 0) {
        throw new Error(`No artifact: ${name} found for: ${workflow} in the run ${latestWorkflowRunId}`);
    }

    const artifact = await octokit.rest.actions.downloadArtifact({
        owner,
        repo,
        artifact_id: matchingArtifacts[0].id,
        archive_format: "zip"
    });

    if (!fs.existsSync(basedir)) {
        throw new Error(`Artifact Download failed: ${name} - Directory does not exist: ${basedir}`);
    }

    const baseName = path.join(basedir, name);
    fs.writeFileSync(`${baseName}.zip`, Buffer.from(artifact.data), 'binary');

    const extractDir = baseName;
    (new admzip(`${baseName}.zip`))
        .extractAllTo(baseName);

    return extractDir;
}


