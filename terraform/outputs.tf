output "master_public_ip" {
  description = "Public IP of the master node"
  value       = aws_instance.k8s_master.public_ip
}

output "master_private_ip" {
  description = "Private IP of the master node"
  value       = aws_instance.k8s_master.private_ip
}

output "worker1_public_ip" {
  description = "Public IP of worker node 1"
  value       = aws_instance.k8s_worker1.public_ip
}

output "worker1_private_ip" {
  description = "Private IP of worker node 1"
  value       = aws_instance.k8s_worker1.private_ip
}

output "worker2_public_ip" {
  description = "Public IP of worker node 2"
  value       = aws_instance.k8s_worker2.public_ip
}

output "worker2_private_ip" {
  description = "Private IP of worker node 2"
  value       = aws_instance.k8s_worker2.private_ip
}

output "ssh_master" {
  description = "SSH command for master node"
  value       = "ssh -i YOUR_KEY.pem ubuntu@${aws_instance.k8s_master.public_ip}"
}

output "ssh_worker1" {
  description = "SSH command for worker 1"
  value       = "ssh -i YOUR_KEY.pem ubuntu@${aws_instance.k8s_worker1.public_ip}"
}

output "ssh_worker2" {
  description = "SSH command for worker 2"
  value       = "ssh -i YOUR_KEY.pem ubuntu@${aws_instance.k8s_worker2.public_ip}"
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.k8s_vpc.id
}

output "subnet_id" {
  description = "Subnet ID"
  value       = aws_subnet.k8s_subnet.id
}
