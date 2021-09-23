# Infrastructure as Code

## Introduction
In the previous exercise, we set up our CI/CD pipeline with our AWS credentials. Upon invoking the pipeline, a bunch of resources were deployed onto AWS.

You were able to access the frontend application that was deployed on an object store. However, the application was unable to connect to the backend component because the backend component does not exist on the cloud yet.

In this section, you will deploy the backend component that you created in the previous workshop onto the cloud. You will then configure the frontend application to connect to your backend component.

---

## Everything on the Cloud

### Deploying Your Backend

#### Background
A template backend is already deployed using [gds-backend.tf](../deployment/gds-backend.tf). In that backend, a container with the image "nginxdemos/hello:plain-text" is deployed, listening on the port 80.

You may try to access that container using the output of step "Apply Deployment" in the pipeline. Look out for something like this:
```
Outputs:

backend_url = "123.4.5.6"
react_url = "gds-react-bucket-jl49qjvn5qq.s3-website-ap-southeast-1.amazonaws.com"
```
In this case, the backend is accessible with the address `http://123.4.5.6`, with an output that looks similar to this:
```
Server address: 172.17.0.2:80
Server name: 48f2c7bd5473
Date: 23/Sep/2021:05:32:55 +0000
URI: /
Request ID: 8bef2d59d5fee61f59684923d659f02e
```

#### Instructions
1. Modify [gds-backend.tf](../deployment/gds-backend.tf) to have your containerised application deployed onto the EC2.
2. Modify [gds-frontend.tf](../deployment/gds-frontend.tf) to ensure that your frontend is pointed to your backend.

#### Definition of Done
1. You should be able to access the backend application from your browser
2. Your frontend application should be able to access your backend application

---

[< Back to Exercises](../exercises/README.md) | [Next Exercise >](./24-CICD-PartII.md)
