FROM mcr.microsoft.com/devcontainers/typescript-node:20-bullseye

RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN architecture=$(uname -m) && \
    if [ "$architecture" = "x86_64" ]; then \
        curl -L "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"; \
    else \
        curl -L "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"; \
    fi && \
    unzip awscliv2.zip && \
    ./aws/install --bin-dir /usr/local/bin --install-dir /usr/local/aws-cli --update

RUN npm install -g aws-cdk

WORKDIR /workspace
