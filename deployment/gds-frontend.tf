/*
S3 Bucket for Frontend Webpage
*/
// Random ID
resource "random_id" "react_frontend_id" {
  byte_length = 8
}

// S3 Bucket
resource "aws_s3_bucket" "react_frontend" {
  bucket = "gds-react-bucket-${lower(random_id.react_frontend_id.id)}"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::gds-react-bucket-jl49qjvn5qq/*"
        }
    ]
}
  EOF
}

// Content Type Setting
locals {
  content_type_ext_mapping = {
    "html" = "text/html"
    "png" = "image/png"
    "svg" = "image/svg+xml"
  }
}

// React Frontend
resource "aws_s3_bucket_object" "react_frontend_build" {
  for_each = fileset("../frontend/build/", "**")
  bucket = aws_s3_bucket.react_frontend.bucket
  key    = each.value
  source = "../frontend/build/${each.value}"
  etag   = filemd5("../frontend/build/${each.value}")
  content_type = lookup(local.content_type_ext_mapping, element(split(".", each.value), length(split(".", each.value)) - 1), "text/html")
}

// Frontend URL
output "react_url" {
  value = aws_s3_bucket.react_frontend.website_endpoint
  description = "The URL of the react application"
}


