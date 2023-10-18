packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type        = string
  description = "AWS region to deploy to"
  default     = "us-east-1"
}

# variable "source_ami" {
#   type        = string
#   description = "AMI to use as a base for the new AMI"
#   default     = "ami-06db4d78cb1d3bbf9"
# }

variable "ssh_username" {
  type        = string
  description = "The username to use to connect to the EC2 instance"
  default     = "admin"
}

variable "subnet_id" {
  type        = string
  description = "The subnet ID to launch the EC2 instance into"
  default     = "subnet-0dead14ccdac4b2bd"
}

variable "ami_regions" {
  type        = list(string)
  default     = ["us-east-1"]
  description = "Regions where AMI should be copied"
}

source "amazon-ebs" "webapp-ami" {
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "CSYE6225 Webapp AMI"
  instance_type   = "t2.micro"
  region          = "${var.aws_region}"
  ami_users       = ["962516605177", "767594034451"]
  ami_regions     = "${var.ami_regions}"

  source_ami_filter {
    filters = {
      name                = "debian-12-amd64-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }
  ssh_username = "${var.ssh_username}"
  subnet_id    = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = [
    "source.amazon-ebs.webapp-ami"
  ]

  # provisioner "shell" {
  #   environment_vars = [
  #     "CHECKPOINT_DISABLE=1",
  #     "DEBIAN_FRONTEND=noninteractive"
  #   ]
  #   inline = [
  #     "sudo chown admin:admin /opt"
  #   ]
  # }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/home/admin"
  }

  provisioner "shell" {
    scripts = ["./install.sh"]
  }
}