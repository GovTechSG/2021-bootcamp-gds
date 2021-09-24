# CI/CD Pipeline Enhancements Solutions

[< Back to Exercises](../exercises/README.md) | [Back to CI/CD Pipeline Enhancements Exercise](../exercises/34-CICD-Enhancements.md)

## Linting

The following is 1 possible solution using the [Super-Linter GitHub Action](https://github.com/github/super-linter). Add the following job to your CI/CD Pipeline in `.github/workflows/main.yml`:

```yaml
jobs:
  Lint:
    name: Lint Codebase with Super-Linter
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
      - name: Lint Codebase
        uses: github/super-linter/slim@v4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

To only lint new or edited files, use the following:

```yaml
jobs:
  Lint:
    name: Lint Codebase with Super-Linter
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
        with:
          # Full git history is needed to get a proper list of changed files within `super-linter`
          fetch-depth: 0
      - name: Lint Codebase
        uses: github/super-linter/slim@v4
        env:
          VALIDATE_ALL_CODEBASE: false
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Image Scanning

The following is 1 possible solution using the [Container Scan GitHub Action](https://github.com/marketplace/actions/container-image-scan). Any **critical** vulnerabilities will be flagged out. Internally, it uses `trivy` to identify vulnerabilities and `Dockle` to identify [CIS benchmarks](https://www.cisecurity.org/benchmark/docker/) and best practice violations.

> ℹ️ Trivy can also be used for IaC scanning for misconfiguration detection in Kubernetes, Docker, and Terraform configurations. You may wish explore using the `Container Scan` GitHub Action to perform IaC scanning as well.

Add the following job to your CI/CD Pipeline in `.github/workflows/main.yml`:

```yaml
jobs:
  Security-Scan:
    name: Scan image for common vulnerabilities and ensures Dockerfile conformity with CIS Benchmarks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Build images
        # Does not push to GHCR
        run: |
          docker build ./frontend --tag ${{ github.actor }}/bootcamp-gds-frontend:test
          docker build ./frontend --tag ${{ github.actor }}/bootcamp-gds-backend:test
      - name: Scan Frontend Image
        uses: azure/container-scan@v0.1
        with:
          image-name: ${{ github.actor }}/bootcamp-gds-frontend:test
          severity-threshold: CRITICAL
      - name: Scan Backend Image
        uses: azure/container-scan@v0.1
        with:
          image-name: ${{ github.actor }}/bootcamp-gds-backend:test
          severity-threshold: CRITICAL
```

It is also a good idea to prevent the image from being pushed to an image registry when vulnerabilities / compliance violations are detected. You can make use of the `needs` keyword to assign job dependencies such that the `Build-And-Push` job requires the `Security-Scan` job to pass.

```yaml
jobs:
  Security-Scan: ...
  Build-And-Push:
    name: Build and Push Application Images
    runs-on: ubuntu-latest
    # https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idneeds
    needs: Security-Scan
    steps: ...
```

## Final Workflow

After combining all the above solutions, your `.github/workflows/main.yml` should look something like this:

```yaml
name: Build and Push Images to GitHub Container Registry (GHCR)
# https://docs.github.com/en/actions/reference/events-that-trigger-workflows
on:
  - push
  - workflow_dispatch
jobs:
  Lint:
    name: Lint Codebase with Super-Linter
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
      - name: Lint Codebase
        uses: github/super-linter/slim@v4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  Security-Scan:
    name: Scan image for common vulnerabilities and ensure Dockerfile conformity with CIS Benchmarks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Build images
        # Does not push to GHCR
        run: |
          docker build ./frontend --tag ${{ github.actor }}/bootcamp-gds-frontend:test
          docker build ./frontend --tag ${{ github.actor }}/bootcamp-gds-backend:test
      - name: Scan Frontend Image
        uses: azure/container-scan@v0.1
        with:
          image-name: ${{ github.actor }}/bootcamp-gds-frontend:test
          severity-threshold: CRITICAL
      - name: Scan Backend Image
        uses: azure/container-scan@v0.1
        with:
          image-name: ${{ github.actor }}/bootcamp-gds-backend:test
          severity-threshold: CRITICAL

  Build-And-Push:
    name: Build and Push Application Images
    runs-on: ubuntu-latest
    # https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idneeds
    needs: Security-Scan
    steps:
      - name: Check out repository code
        uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
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

## Automated Dependency Updating

The following is 1 possible solution using [Dependabot](https://dependabot.com/). It performs daily checks for updates to any GitHub Actions used in the CI/CD Pipeline, as well as dependency updates for the frontend and backend application. If updates are found, Pull Requests (PR) will be automatically created.

Create a file `.github/dependabot.yml` in the `main` branch and add the following configurations:

```yaml
version: 2
updates:
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
    # Raise pull requests for version updates
    # to pip against the `main` branch
    target-branch: "main"
    # Prefix all commit messages with "github-actions"
    commit-message:
      prefix: "github-actions"
      include: "scope"
  # Maintain dependencies for npm (frontend)
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "daily"
    # Raise pull requests for version updates
    # to pip against the `main` branch
    target-branch: "main"
    # Prefix all commit messages with "npm"
    # include a list of updated dependencies
    commit-message:
      prefix: "npm-frontend"
      include: "scope"
  # Maintain dependencies for npm (backend)
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "daily"
    # Raise pull requests for version updates
    # to pip against the `main` branch
    target-branch: "main"
    # Prefix all commit messages with "npm"
    # include a list of updated dependencies
    commit-message:
      prefix: "npm-backend"
      include: "scope"
```

When successfully created, pull requests should be automatically created. For example:  
![Automated PRs with dependency updates](https://user-images.githubusercontent.com/11332803/134580206-81266c42-96e6-4462-96f0-598e94b1e5f3.png)

---

[< Back to Exercises](../exercises/README.md) | [Back to CI/CD Pipeline Enhancements Exercise](../exercises/34-CICD-Enhancements.md)
