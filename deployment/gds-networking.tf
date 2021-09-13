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
