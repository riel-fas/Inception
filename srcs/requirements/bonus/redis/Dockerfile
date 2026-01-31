FROM alpine:3.19

RUN apk update && apk upgrade && \
    apk add --no-cache redis && \
    mkdir -p /etc/redis /var/log/redis

# Copy configuration and setup script
COPY conf/redis.conf /etc/redis/redis.conf
COPY tools/redis_setup.sh /usr/local/bin/redis_setup.sh

# Set permissions
RUN chmod +x /usr/local/bin/redis_setup.sh

EXPOSE 6379

# Use the script to launch the service
ENTRYPOINT ["/usr/local/bin/redis_setup.sh"]