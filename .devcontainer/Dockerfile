FROM mcr.microsoft.com/devcontainers/base:ubuntu

USER root

RUN apt-get update \
    && apt-get install -y git curl python3 python3-pip build-essential \
    && rm -rf /var/lib/apt/lists/*

USER vscode