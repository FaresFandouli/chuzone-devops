variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.medium"
}

variable "key_name" {
  description = "Name of the SSH key pair (must exist in AWS)"
  type        = string
  # You must create this key pair in AWS EC2 console first
  # or use: aws ec2 create-key-pair --key-name chuzone-key --query 'KeyMaterial' --output text > chuzone-key.pem
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "ChuZone-DevOps"
}
