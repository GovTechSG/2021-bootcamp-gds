/******************************************************************
  DEFINE VPC, Subnets, IGW
  1. We will not use NAT Gateway because it costs money
******************************************************************/
resource "aws_vpc" "gds_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "gds-bootcamp-2021"
  }
}

resource "aws_subnet" "public_subnet_1" {
  vpc_id            = aws_vpc.gds_vpc.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = "ap-southeast-1a"

  tags = {
    Name = "gds-bootcamp-2021-public-1a"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id            = aws_vpc.gds_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-southeast-1b"

  tags = {
    Name = "gds-bootcamp-2021-public-1b"
  }
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.gds_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "ap-southeast-1a"

  tags = {
    Name = "gds-bootcamp-2021-private-1a"
  }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id            = aws_vpc.gds_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "ap-southeast-1b"

  tags = {
    Name = "gds-bootcamp-2021-private-1b"
  }
}

resource "aws_internet_gateway" "gds_igw" {
  vpc_id = aws_vpc.gds_vpc.id

  tags = {
    Name = "gds_vpc_igw"
  }
}

/******************************************************************
  CREATION of Routes
******************************************************************/
/*
Route Table: Internet Access for Public Subnets
*/
resource "aws_route_table" "route_table_public_az" {
  vpc_id = aws_vpc.gds_vpc.id
  
  tags = {
    Name = "public-az-route"
  }
}

resource "aws_route" "route-public-az-internet" {
  route_table_id = aws_route_table.route_table_public_az.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.gds_igw.id
}

// Attachment to public_subnet_1
resource "aws_route_table_association" "route_public_az1_association" {
  subnet_id = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.route_table_public_az.id
}

// Attachment to public_subnet_2
resource "aws_route_table_association" "route_public_az2_association" {
  subnet_id = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.route_table_public_az.id
}

/******************************************************************
  CREATION of Security Groups
******************************************************************/
/*
Allow All Security Group
*/
resource "aws_security_group" "allow_all" {
  name        = "allow_all"
  description = "Super Permissive Security Group"
  vpc_id      = aws_vpc.gds_vpc.id

  tags = {
    Name    = "gds_bad_security_group"
  }
}


resource "aws_security_group_rule" "allow_all_ingress" {
  security_group_id = aws_security_group.allow_all.id
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "all"
  cidr_blocks = [
    "116.89.41.13/32"
  ]
  description = "Allows all ingress"
}

resource "aws_security_group_rule" "allow_all_egress" {
  security_group_id = aws_security_group.allow_all.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "all"
  cidr_blocks = [
    "0.0.0.0/0"
  ]
  description = "Allows all egress"
}
