/*
ECS for backend management
*/
resource "aws_ecs_cluster" "gds_ecs_cluster" {
  name = "gds_ecs_cluster"
  
  setting {
    name  = "containerInsights"
    value = "disabled"
  }
}