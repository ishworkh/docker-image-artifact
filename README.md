# Docker Image Artifact

Module providing functionality for uploading and downloading docker images in a github action workflow across jobs. It leverages github artifact in the background.

It exposes three public methods from ![main script](https://github.com/ishworkh/docker-image-artifact/blob/master/src/index.js) namely `upload`, `download`, and `createOctokitArtifactDownloader`.
