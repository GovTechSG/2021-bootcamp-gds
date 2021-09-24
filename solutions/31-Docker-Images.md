# Docker Images Solutions

[< Back to Exercises](../exercises/README.md) | [Back to Docker Images Exercise](../exercises/31-Docker-Images.md)

## Optimizing Images

To reduce the image sizes, use the `alpine` based variant of the `node` image as the parent image of the Dockerfile for the frontend and backend.

Frontend:

```Dockerfile
# Replace `node:14` with `node:14-alpine`
FROM node:14-alpine

ARG user="node"
ARG appdir="/home/node/app"

RUN mkdir -p ${appdir} && chown -R ${user} ${appdir}
WORKDIR ${appdir}
USER ${user}

COPY --chown=${user} package.json package-lock.json ./
RUN npm install

COPY --chown=${user} . .

CMD [ "npm", "start" ]
```

Backend:

```Dockerfile
# Replace `node:14` with `node:14-alpine`
FROM node:14-alpine

ARG user="node"
ARG appdir="/home/node/app"

RUN mkdir -p ${appdir} && chown -R ${user} ${appdir}
WORKDIR ${appdir}
USER ${user}

COPY --chown=${user} package.json package-lock.json ./
RUN npm install

COPY --chown=${user} . .

RUN npm run build

CMD [ "npm", "start" ]
```

You may also check out [this article](https://derickbailey.com/2017/03/09/selecting-a-node-js-image-for-docker/) on which parent image to use for Node.js-based applications.

## Build and Push Images with GitHub Actions

The following is 1 possible solution to build images with [Docker's buildx](https://github.com/docker/buildx) and push the images to the [GitHub Container Registry (GHCR)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

Create the file `.github/workflows/main.yml` with the following configurations:

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
      # An alternative to the following steps is to use the build-push-action: https://github.com/docker/build-push-action
      - name: Build and Push the Frontend Docker Image
        run: |
          docker build ./frontend --tag ghcr.io/${{ github.actor }}/bootcamp-gds-frontend:${{ github.sha }}
          docker push ghcr.io/${{ github.actor }}/bootcamp-gds-frontend:${{ github.sha }}
      - name: Build and Push the Backend Docker Image
        run: |
          docker build ./backend --tag ghcr.io/${{ github.actor }}/bootcamp-gds-backend:${{ github.sha }}
          docker push ghcr.io/${{ github.actor }}/bootcamp-gds-backend:${{ github.sha }}
      - name: Copy the images with their tags to your docker-compose.yml
        run: |
          echo "ghcr.io/${{ github.actor }}/bootcamp-gds-frontend:${{ github.sha }}"
          echo "ghcr.io/${{ github.actor }}/bootcamp-gds-backend:${{ github.sha }}"
```

## Using Built Images

Modify your `docker-compose.yml` file with the image + tags uploaded to GHCR:

```yaml
version: '3.0'

services:
  frontend:
    # Replace with your image
    image: ghcr.io/<your username>/bootcamp-gds-frontend:<your commit SHA>
    command: "npm start"
    environment:
      NODE_ENV: development
      APP_URL: http://localhost:3000
      API_URL: http://backend:3001
    ports:
      - 3000:3000
  
  backend:
    # Replace with your image
    image: ghcr.io/<your username>/bootcamp-gds-backend:<your commit SHA>
    command: "npm start"
    environment:
      NODE_ENV: development
      APP_URL: http://localhost:3000
      API_URL: http://localhost:3001
      PORT: 3001
    ports:
      - 3001:3001
```

Run `docker-compose up --build` and ensure that both the frontend and backend are working.

---

[< Back to Exercises](../exercises/README.md) | [Back to Docker Images Exercise](../exercises/31-Docker-Images.md)
