const { upload, download } = require("./image_artifact");
const { createOctokitArtifactDownloader } = require("./github_artifact");

module.exports = {
  upload,
  download,
  createOctokitArtifactDownloader
}
