# Clean Up

## Introduction
```
WARNING: Remember to clean up all AWS resources to ensure that you do not get a surprise charge 12 months from today. 
```
---

## Removing Everything from the Cloud

### Removing Your Resources

#### Background
One of the reasons we deploy our resources using Infrastructure-as-Code (IaC) is because of the ease of representing all resources that are deployed.

If the resource exists in code, it exists in the cloud. Similarly, if the resource ceases to exist within the code, it would cease to exist in the cloud as well (which is exactly what we want at this moment).

#### Instructions
1. Comment out all the resources in [gds-backend.tf](../deployment/gds-backend.tf), [gds-frontend.tf](../deployment/gds-frontend.tf), and [gds-networking.tf](../deployment/gds-networking.tf).
2. Push to git, and verify that the resources in AWS are all deleted.
3. Sign in to the AWS Console: https://console.aws.amazon.com
4. Delete the following resources:
    1. All S3 Buckets: `gdsbucket-tf-xxxxxxxxxxxx`
    2. All DynamoDB Tables: `gdstable-tf-xxxxxxxxxxxx`
5. All done!

#### Definition of Done
1. All resources in AWS are deleted
---
### Removing Access
#### Background
In 20-DevOps, you created access keys in order to manage your AWS resources from the GitHub Actions pipeline. Since you are no longer using those keys (now that we're at the end of this exercise), it is best practice to have the keys deleted.
#### Instructions
1. Sign in to the AWS Console: https://console.aws.amazon.com
2. Click on your account name in the navigation bar, and then choose "My Security Credentials"
3. Expand the "Access keys" section
4. Delete the Access Key
5. All done!
---
### Optional - Deleting AWS Account
If you no longer want to keep your AWS Account for whatever reasons (e.g. fear of unauthorised usage charges appearing on your credit card), you may choose to delete your AWS Account by following the instructions here: https://aws.amazon.com/premiumsupport/knowledge-center/close-aws-account/

[< Back to Exercises](../exercises/README.md) 
