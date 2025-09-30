#!/bin/bash

# Deployment script for Car Rental Backend to AWS

set -e

echo "Starting backend deployment..."

# Configuration
APP_NAME="car-rental"
ENVIRONMENT="production"
AWS_REGION="us-east-1"
ECR_REPOSITORY="${APP_NAME}-backend"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "Error: AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

echo "AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "ECR Repository: ${ECR_URI}"

# Create ECR repository if it doesn't exist
echo "Creating ECR repository..."
aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} > /dev/null 2>&1 || \
aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION}

# Get login token for ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

# Build Docker image
echo "Building Docker image..."
cd ../../backend
docker build -f ../aws/docker/Dockerfile.backend -t ${ECR_REPOSITORY}:latest .

# Tag image for ECR
docker tag ${ECR_REPOSITORY}:latest ${ECR_URI}:latest

# Push image to ECR
echo "Pushing image to ECR..."
docker push ${ECR_URI}:latest

# Deploy to ECS (if using ECS)
echo "Deploying to ECS..."
aws ecs update-service --cluster ${APP_NAME}-cluster --service ${APP_NAME}-backend-service --force-new-deployment --region ${AWS_REGION} > /dev/null 2>&1 || \
echo "ECS service not found. Please create ECS service first."

echo "Backend deployment completed successfully!"
echo "Image URI: ${ECR_URI}:latest"
