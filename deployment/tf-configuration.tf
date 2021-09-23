# Backend
terraform {
  backend "s3" {
  }
}

# Provider
provider "aws" {
  region = "ap-southeast-1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.59.0"
    }
    random = {
      source = "hashicorp/random"
      version = "~> 2.2.1"
    }
  }
}