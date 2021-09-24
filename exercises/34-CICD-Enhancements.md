# CI/CD Pipeline Enhancements

## Introduction

> This exercise is an **optional** stretch goal. If you are short on time, you may wish to work on this exercise after the workshop. Please proceed to the [next exercise](./35-CleanUp.md) to clean up your environment.

In this exercise, we will be extending the CI/CD pipeline you created in the [previous exercise](./31-Docker-Images.md) to add several automated tools.

These include:

1. Code Linting
2. Image Scanning
3. IaC Scanning
4. Automated Dependency Updating

Leveraging on these tools allows Developers to detect and prevent defects in their codebase earlier in the Software Development Lifecycle (SDLC) more frequently. This is known as "Shift-Left Testing" in DevOps, and it fully embodies the "Test early and often" mantra typically seen in Agile organizations practicing iterative development.

## Prerequisites

You should have completed all previous exercises:

1. [DevOps Setup](./20-DevOps.md)
2. [Deploy Frontend to the Cloud](./21-CICD-PartI.md)
3. [Docker Images](./22-Docker-Images.md)
4. [Infrastructure-as-Code](./23-InfrastructureAsCode.md)

## Enhancing the CI/CD Pipeline

### Linting

Code linters are static code analysis tools commonly used to improve the quality of code.

Linters help to flag out:

- Formatting and styling inconsistencies
- Non-adherence to coding standards and conventions
- Common logical bugs / errors

Typically, different programming languages will have their own specialized linters specific to the syntax of the language. Modern linters will also allow developers to add custom rules.

#### Stretch Goal 1

Add a new job in `.github/workflows/main.yml` to automatically lint the codebase.

Requirements:

1. Flag out code quality issues in the frontend and backend source code
2. (Optional) Lint other files in the repository such as the yaml files used to define your CI/CD pipeline

You can consider using the [Super-Linter GitHub Action](https://github.com/github/super-linter), which natively supports linting all languages in the codebase (ie. Javascript, Dockerfile, GitHub Actions).

Upon successfully completing the exercise, the job will most likely fail as there are several linting errors in the codebase. You may consider following the recommendations to fix the errors.

![Lint errors](https://user-images.githubusercontent.com/11332803/134580397-d7d0fb68-eedd-409e-a809-b78ce53473b3.png)

### Image Scanning

In almost all projects small or large, you will likely depend on external libraries to develop your applications. You may take a look at the dependencies required by the frontend and backend in the respective `package.json` files.

Even the most widely used dependencies may contain vulnerabilities. Vulnerabilities in dependencies may expose your application to potential exploitation and affects its security posture. It is important to keep all dependencies up-to-date so that these security risks are mitigated.

However, it is tedious to perform these checks manually, especially for larger projects that utilise many external libraries. It is also difficult to be thorough, since the libraries may also depend on other libraries that could contain vulnerabilities.

This process of scanning your application for such vulnerabilities can be fully-automated with the help of a CI/CD pipeline and image scanning tools. When vulnerabilities are discovered and publicly disclosed, they are usually assigned a [Common Vulnerabilities and Exposures glossary (CVE)](https://cve.mitre.org/) entry with a unique ID. Whenever the pipeline runs, these automated tools reference known CVEs to detect vulnerable dependencies in your application and propose remediation measures.

Some tools may also include additional compliance checks to ensure that applications adhere to industry-recognized benchmarks or best practices, such as the [CIS Docker Benchmarks](https://www.cisecurity.org/benchmark/docker/).

#### Stretch Goal 2

Add a new job in `.github/workflows/main.yml` to automatically scan the frontend and backend images for vulnerabilities.

Requirements:

- Flag out vulnerabilities found in the images
- Prevent the `Build-And-Push` from running if vulnerabilities are detected

There are several open-source image scanning GitHub Actions available to accomplish this task. You may consider using the [Container Scan GitHub Action](https://github.com/Azure/container-scan) which scans for vulnerable dependencies and checks for adherence to CIS Benchmarks.

### Automated Dependency Updating

In the previous task, image scanning tools were added to detect vulnerabilities in your codebase. However, this detection only happens when the pipeline is ran and should not be your only security mechanism relied upon. If no code changes are made for a long period of time, you will not be alerted of outdated / vulnerable dependencies automatically.

To complement image scanning tools, dependency auto-updating tools can be used. They can be used to:

1. Automatically check codebase for vulnerable dependencies periodically.
2. Automatically check the CI/CD pipeline for outdated dependencies periodically. The CI/CD pipeline also depends on open-source GitHub Actions, which receive updates frequently.
3. Suggest appropriate remediation actions by upgrading outdated dependencies automatically (either as direct commits or Pull Requests).

#### Stretch Goal 3

Add automated dependency updating to your repository. You may consider using [dependabot](https://dependabot.com/).

Requirements:

1. Check for outdated GitHub Actions used in the CI/CD pipeline
2. Check for outdated Node.js dependencies in the frontend and backend code
3. Automated daily checks
4. Automated suggested fixes via Pull Requests

### Infrastructure-as-Code (IaC) Scanning

TODO:

TFSec

#### Stretch Goal 4

Add TFSec job to `.github/workflows/deploy-to-aws.yml`

### Further Stretch Goals

In addition to the above stretch goals, you may consider working on these challenges in your own time for learning:

- Add unit tests to the frontend and backend code and automate testing in the CI/CD pipeline
- Further reduce the size of the frontend and backend images
- Refactor the pipeline to use the [build-push-action GitHub Action](https://github.com/docker/build-push-action)
- Implement caching
  - https://github.com/docker/build-push-action/blob/master/docs/advanced/cache.md
  - https://evilmartians.com/chronicles/build-images-on-github-actions-with-docker-layer-caching
- Deploy other cloud services via IaC

---

Congratulations on completing the stretch goals! Do remember to move on to the final exercise to clean up your cloud environment.

---

[< Back to Exercises](../exercises/README.md) | [Solution](../solutions/34-CICD-Enhancements.md) | [Next Exercise >](./35-CleanUp.md)
