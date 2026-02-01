FROM debian:12

# Update package list and install required packages
RUN apt-get update && apt-get install -y \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create portainer directory
RUN mkdir -p /opt/portainer

# Download Portainer binary
RUN cd /opt/portainer && \
    wget https://github.com/portainer/portainer/releases/download/2.33.0/portainer-2.33.0-linux-amd64.tar.gz && \
    tar -xzf portainer-2.33.0-linux-amd64.tar.gz && \
    chmod +x portainer && \
    rm portainer-2.33.0-linux-amd64.tar.gz

# Create data directory
RUN mkdir -p /data

# Expose port
EXPOSE 9443

# Start Portainer
CMD ["/opt/portainer/portainer/portainer", "--data", "/data"]
