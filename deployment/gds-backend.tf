/******************************************************************
  EC2 for Backend Services
******************************************************************/
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
    docker run -d -p 80:80 nginxdemos/hello:plain-text
  EOF
  )
}

output "backend_url" {
  value = aws_instance.gds_backend_ec2.public_ip
  description = "The URL of the backend application"
}