# AWS Deployment Configuration

This directory contains AWS deployment configurations for the Car Rental application.

## Architecture Overview

The application will be deployed on AWS using the following services:

- **EC2**: Host the .NET Web API backend
- **RDS**: MongoDB Atlas or AWS DocumentDB for database
- **S3**: Store static files and car images
- **CloudFront**: CDN for static content
- **Application Load Balancer**: Load balancing for the API
- **Route 53**: DNS management
- **CloudWatch**: Monitoring and logging

## Deployment Structure

```
aws/
├── terraform/           # Infrastructure as Code
├── docker/             # Docker configurations
├── scripts/            # Deployment scripts
└── monitoring/         # CloudWatch configurations
```

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. Terraform installed (for infrastructure)
3. Docker installed (for containerization)
4. MongoDB Atlas account or AWS DocumentDB setup

## Quick Start

1. **Setup Infrastructure**:
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

2. **Deploy Backend**:
   ```bash
   cd ../scripts
   ./deploy-backend.sh
   ```

3. **Deploy Frontend**:
   ```bash
   ./deploy-frontend.sh
   ```

## Environment Configuration

Update the following environment variables for your deployment:

- `MONGODB_CONNECTION_STRING`: Your MongoDB connection string
- `API_BASE_URL`: Your API endpoint URL
- `AWS_REGION`: Your AWS region
- `S3_BUCKET_NAME`: Your S3 bucket for static files

## Security Considerations

- Use IAM roles with minimal required permissions
- Enable VPC for database security
- Configure security groups properly
- Use HTTPS for all communications
- Enable CloudTrail for audit logging
