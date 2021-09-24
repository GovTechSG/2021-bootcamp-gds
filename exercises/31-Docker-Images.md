# Docker Images

## Introduction

In this exercise, we will be investigating how Docker Compose works and create a CI/CD pipeline with GitHub Actions to automatically build and push images to GitHub Container Registry.

## Prerequisites

1. Installed Docker Desktop
2. Forked the repository and checkout `main` branch to have the completed frontend and backend
3. Successfully ran `docker-compose up` for the frontend and backend from yesterday's workshop

## Exercises

### Understanding docker-compose.yml

In yesterday's workshop, you were able to run the frontend and backend servers locally using the `docker-compose up` command.

This was made possible with the help of the `docker-compose.yml` file, which consists of the necessary configurations to build images, mount volumes, expose ports, run containers, etc.

```yaml
version: '3.0'

services:
  frontend:
    build: ./frontend
    command: "npm start"
    environment:
      NODE_ENV: development
      APP_URL: http://localhost:3000
      API_URL: http://backend:3001
    volumes:
      - ./frontend/src:/home/node/app/src
    ports:
      - 3000:3000
  
  backend:
    build: ./backend
    command: "npm start"
    environment:
      NODE_ENV: development
      APP_URL: http://localhost:3000
      API_URL: http://localhost:3001
      PORT: 3001
    volumes:
      - ./backend/src:/home/node/app/src
    ports:
      - 3001:3001
```

Let's breakdown the configurations for the frontend service, which can be applied to the backend as well:

1. `build: ./frontend`: Specifies the build context (ie. path to the Dockerfile). This is like running the `docker build ./frontend` command.
2. `command: "npm start"`: Specifies the command to be executed by the container. Overrides `CMD` in the Dockerfile.
3. `environment:`: Specifies environment variables.
4. `volumes: - ./frontend/src:/home/node/app/src`: Mount a host path. The syntax is `SOURCE:TARGET`. In this case, `./frontend/src` from the host is mounted to `/home/node/app/src` in the container.
5. `ports: - 3001:3001`: Expose ports in the format `HOST:CONTAINER`.

You will need to modify this file in a later exercise. Optionally, you may wish to view the full [Docker Compose configuration reference](https://docs.docker.com/compose/compose-file/compose-file-v3/) for further learning.

### Optimizing Images

There are lots of ways to write a Dockerfile to containerize your application. While the resulting container may be functional, it may not be the most optimized.

Let's take a look at the images we are currently using for our docker-compose file.

1. Run `docker images "2021-bootcamp-gds_*"`
2. Observe the output:

```shell
REPOSITORY                   TAG       IMAGE ID       CREATED          SIZE
2021-bootcamp-gds_backend    latest    9d04f54e59e1   2 minutes ago    1.09GB
2021-bootcamp-gds_frontend   latest    b58aa01fdd7d   2 minutes ago    1.22GB
```

As shown, each image is > 1GB in size! For a simple web application, the storage requirements seem rather large. Some disadvantages of having large unoptimized images include:

1. Higher storage requirements. You may easily exceed storage quotas in your image registries.
2. Higher bandwidth utilization to download and upload images.
3. Potentially slower image build times.

If we take a look at one of the Dockerfiles (either in `/frontend` or `/backend`), we will notice the first line `FROM node:14`. This specifies the parent image to be used to build the image.

In this case, the `node:14` image is built from Debian Linux with Node.js v14 installed, along with a bunch of additional source controls software, libraries and build tools. You may not require all these additional tools in most cases.

A common way to reduce image size is to use another parent image that does not have these additional tools installed, or choose a parent image built on other lighter Linux Distributions like Alpine.

You can view other image variants for Node.js [here](https://hub.docker.com/_/node).

#### Exercise 1

Replace the parent image for the frontend and backend image to reduce its size.

**Steps:**

1. Navigate to the frontend Dockerfile (`/frontend/Dockerfile`).
2. Modify the parent image to another more lightweight image.
3. Repeat step 2 for the backend Dockerfile.
4. Run `docker-compose up --build`. After it is done, run `docker images "2021-bootcamp-gds_*"` in a separate terminal and observe the differences in image size. See if you are able to bring the image size down to around 300mb!

### Build and Push Images with GitHub Actions

There are drawbacks to the way we build and run our application now:

1. It is difficult to share images with other members in the project team since everything is done locally.
2. We must manually run commands to rebuild images every time any code changes are made.

Fortunately, we can resolve both issues with the help of image registries and automation.

1. Images can be pushed (uploaded) to an image registry, which can be pulled (downloaded) by the rest of your team. Image registries are a central place to store and distribute images. Some examples include Dockerhub and the GitHub Container Registry (GHCR).
2. We can configure CI/CD pipelines to automatically build and push the images to an image registry. This can be achieved using GitHub Actions.

Note that it is a best practice to use a unique tag for each image pushed to an image registry. This is to ensure that images are immutable (ie. will not be changed). For example, we can use the Git commit SHA for the image tag.

#### Exercise 2

Create a pipeline using GitHub Actions to build and push the frontend and backend images to GitHub Container Registry (GHCR).

**Steps:**

1. Create a `main.yml` file at the path `.github/workflows/`. Create the directories if they do not exist.
2. Copy and paste the baseline configuration provided to you below and replace the `<INSERT COMMANDS HERE>`. You may consult the [Official Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) or start Googling :)
3. Commit your newly created pipeline file. GitHub Actions should automatically start running. You can view it at the "Actions" tab in your repository.
4. Verify that the pipeline completes successfully.

Hint: You would run the same commands used to build a Docker image locally as you would in the CI/CD pipeline. Consider using `docker build` and `docker push`.

Here's the baseline configuration for you to get started:

```yaml
name: Build and Push Images to GitHub Container Registry (GHCR)
# https://docs.github.com/en/actions/reference/events-that-trigger-workflows
on:
  - push
  - workflow_dispatch
jobs:
  Build-And-Push:
    name: Build and Push Application Images
    runs-on: ubuntu-latest
    steps:
      # https://github.com/marketplace/actions/checkout
      - name: Check out repository code
        uses: actions/checkout@v2
      # https://github.com/docker/setup-buildx-action
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      # https://github.com/docker/login-action#github-container-registry
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v1
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and Push the Frontend Docker Image
        run: |
          <INSERT COMMANDS HERE>
      - name: Build and Push the Backend Docker Image
        run: |
          <INSERT COMMANDS HERE>
      # To make it easier to copy-paste the image later
      - name: Copy the images with their tags to your docker-compose.yml
        run: |
          echo "ghcr.io/${{ github.actor }}/bootcamp-gds-frontend:${{ github.sha }}"
          echo "ghcr.io/${{ github.actor }}/bootcamp-gds-backend:${{ github.sha }}"
```

### Using Built Images

The current docker-compose.yml file builds the image locally and runs it.

We can modify the file to pull the images from GHCR that you just pushed instead. This is useful when sharing images with other team members and to ensure that everyone is using a consistent image to run their application.

These images can also be used for cloud deployments, which you will get to try in the next few exercises.

#### Exercise 3

Modify the `docker-compose.yml` file to use the images pushed to GHCR.

**Steps:**

1. Navigate to the `docker-compose.yml` file.
2. Remove the `volumes:` keyword for both frontend and backend.
3. Replace `build:` with `images:` and specify the image + tag stored in GHCR for both frontend and backend.
4. Run `docker-compose up --build` and verify that the application is working locally as before.

### Stopping The Application

Once done, run `docker-compose down` to stop the containers that are running locally.

In the next exercise, we will begin deploying the frontend to AWS so that the application is accessible over the web.

---

[< Back to Exercises](../exercises/README.md) | [Solution](../solutions/31-Docker-Images.md) | [Next Exercise >](./32-Deploy-Frontend-IaC.md)
