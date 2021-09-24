# Deploying the Frontend with IaC

## Introduction

In this exercise, we will be setting up the Continuous Integration, Continuous Delivery (CI/CD) pipeline.

According to Redhat, "A CI/CD pipeline is a series of steps that must be performed in order to deliver a new version of software."

---

## Setting Up The CI/CD Pipeline

### Create AWS Access Keys

#### Pre-Requisites

1. 20-DevOps is complete

#### Instructions

1. Sign in to the AWS Console: https://console.aws.amazon.com
2. Click on your account name in the navigation bar, and then choose "My Security Credentials"
3. Expand the "Access keys" section
4. Create New Access Key
5. Save the Access Key ID and Secret Access Key somewhere safe
6. All done!

```
WARNING: Treat both the Access Key ID and Secret Access Key with the respect that you'd give to any other password. Leaking these credentials may result in heavy credit card bills.
```

### Setup GitHub Secrets

In this section, you will set the secrets obtained from the previous section in your Gitlab repository. The CI/CD pipeline will make use of the secrets to interact with your AWS environment.

#### Instructions

1. Store your AWS secrets in your Github Repository
   1. Navigate to your repository page
   2. Go to the repository "Settings"
   3. Go to the "Secrets" section on the left panel
   4. Create two new repository secrets: <AWS_ACCESS_KEY_ID>, <AWS_SECRET_ACCESS_KEY>, from the secrets obtained in the previous section
2. Run the GitHub Actions
3. Check your AWS Console, you should see that:
   1. A VPC is created
   2. 4 Subnets are created
   3. An internet gateway is created
   4. An S3 Bucket is created
   5. Your React Application is stored in the S3 Bucket
4. Review the Github Actions logs to see the steps that were carried out
   1. Note that under the Deploy-With-TF job, the step "Plan Deployment" describes the resources that will be deployed into the cloud
   2. A URL to access your deployed React Application can be found in the step "Apply Deployment"
   3. The URL should look something like this: `gds-react-bucket-abcd1234def.s3-website-ap-southeast-1.amazonaws.com`
5. You should be able to access your React Application from the URL
6. All done!

---


[< Back to Exercises](../exercises/README.md) | [Next Exercise >](./33-Deploy-Backend-IaC.md)
