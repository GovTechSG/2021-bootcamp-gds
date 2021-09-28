# Deploy Backend IaC Solutions

[< Back to Exercises](../exercises/README.md) | [Back to Deploy Backend IaC Exercise](../exercises/33-Deploy-Backend-IaC.md)

### Deploying Backend
Set Docker to run with the image that you created in the previous exercise.

```
resource "aws_instance" "gds_backend_ec2" {
  ami = "ami-082105f875acab993"
  instance_type =  "t2.micro"

  # Network
  associate_public_ip_address = true
  vpc_security_group_ids = [ aws_security_group.allow_all.id ]
  subnet_id = aws_subnet.public_subnet_1.id

  ebs_block_device {
    device_name = "/dev/xvda"
    encrypted = true
    volume_size = 8
  }

  user_data = base64encode(<<EOF
    #!/bin/bash
    yum update -y
    yum install docker -y
    service docker start
    docker run -d -e PORT=3001 -p 80:3001 ghcr.io/your-repo/bootcamp-gds-backend:4bb5a7e98ccc55fddb6fc05279d402afa151467f
  EOF
  )
}
```

### Connecting Frontend to Backend
Make use of interpolation to replace the Endpoint to the public IP address of the instance deployed by gds-backend.tf.

```
resource "aws_s3_bucket_object" "react_frontend_build_js" {
  for_each = {
    for file in fileset("../frontend/build/", "**") : file => file
    if substr(file, -3, -1) == ".js"
  }
  bucket  = aws_s3_bucket.react_frontend.bucket
  key     = each.value
  content = replace(file("../frontend/build/${each.value}"), "$${TF_ENDPOINT_INPUT}", "http://${aws_instance.gds_backend_ec2.public_ip}/api")
  etag    = md5(replace(file("../frontend/build/${each.value}"), "$${TF_ENDPOINT_INPUT}", "http://${aws_instance.gds_backend_ec2.public_ip}/api"))
  content_type = "text/html"
}
```

### Ensure Backend Connectivity from your local machine

```
resource "aws_security_group_rule" "allow_all_ingress" {
  security_group_id = aws_security_group.allow_all.id
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "all"
  cidr_blocks = [
    "116.89.41.13/32" # << Replace with your local IP address
  ]
  description = "Allows all ingress"
}
```

---

[< Back to Exercises](../exercises/README.md) | [Back to Deploy Backend IaC Exercise](../exercises/33-Deploy-Backend-IaC.md)