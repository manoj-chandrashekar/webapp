variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "ami_regions" {
  type    = list(string)
  default = ["us-east-1"]
}