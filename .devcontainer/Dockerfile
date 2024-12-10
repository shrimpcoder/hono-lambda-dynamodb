# Ubuntuベースの設定
FROM node:20-bullseye

# Install basic development tools
RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    docker.io \
    && rm -rf /var/lib/apt/lists/*

# AWS SAMのインストール
RUN curl -L "https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip" -o "aws-sam-cli-linux-x86_64.zip" \
    && unzip aws-sam-cli-linux-x86_64.zip -d sam-installation \
    && ./sam-installation/install \
    && rm -rf aws-sam-cli-linux-x86_64.zip sam-installation

RUN npm install -g aws-cdk

# Dockerを使用するためのグループ設定
RUN usermod -aG root node

# Set environment variable
ENV DEVCONTAINER=true

WORKDIR /workspace
RUN chown -R node:node /workspace
USER node

