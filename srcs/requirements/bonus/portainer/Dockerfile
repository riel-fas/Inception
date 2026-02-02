# Use Alpine Linux as base image
FROM alpine:3.19

# Update package list and install required packages
# Note: libc6-compat is needed because the Portainer binary is compiled for glibc
RUN apk update && apk add --no-cache \
    wget \
    ca-certificates \
    libc6-compat \
    gcompat

# Create portainer directory
RUN mkdir -p /opt/portainer

# Download Portainer binary
RUN cd /opt/portainer && \
    wget https://github.com/portainer/portainer/releases/download/2.33.0/portainer-2.33.0-linux-amd64.tar.gz && \
    tar -xzf portainer-2.33.0-linux-amd64.tar.gz && \
    rm portainer-2.33.0-linux-amd64.tar.gz

# Create data directory
RUN mkdir -p /data

# Expose ports
EXPOSE 9443 9000

# Start Portainer - let it auto-generate SSL certs and handle everything
CMD ["/opt/portainer/portainer/portainer", \
     "--data", "/data", \
     "--tunnel-port", "9000"]