# Docker Image Artifact

Module providing functionality for uploading and downloading docker images in a github action workflow across jobs. It leverages github artifact in the background.

It exposes four public methods from ![main script](https://github.com/ishworkh/docker-image-artifact/blob/master/src/index.js) namely `upload`, `download`, `artifactDownloader` and `createOctokitArtifactDownloader`.

## upload

Function to upload image as a github artifact to the current workflow run.

```nodejs

uploadImage(image, artifactUploader, retentionDays = 0)

```

## download

Function to download image.

```nodejs

downloadImage(image, artifactDownloader)

```

## createArtifactDownloader

Function that creates core action artifact downloader. This downloader uses [`@actions/artifact`](https://github.com/actions/toolkit/tree/master/packages/artifact) module underneath and is capable of downloading artifacts from the same workflow.

## createOcotokitArtifactDownloader

Factory function that creates octokit artifact downloader. This downloader uses [`octokit`](https://github.com/octokit/action.js/) module underneath. This downloader is capable of downloading artifacts from another workflow.

  // Github artifact downloaders - 2 types
  //  artifactDownloader - core action artifact downloader
  //  octokitArtifactDownloader - octokit artifact downloader. Exposes a factory method to create the downloader.
  artifactDownloader: artifactDownloader,
  createOctokitArtifactDownloader

## createArtifactUploader

Function that creates core action artifact uploader. This uploader uses [`@actions/artifact`](https://github.com/actions/toolkit/tree/master/packages/artifact) module underneath.
