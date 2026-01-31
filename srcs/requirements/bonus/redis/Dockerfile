# Use Alpine Linux as base image (penultimate stable version)
FROM alpine:3.19

#Install Redis
RUN apk update && apk add --no-cache \
    redis \ 
    && rm -rf /var/cache/apk/*

#Create necessary directories
RUN mkdir -p /var/log/redis && \
    chown -R redis:redis /var/log/redis && \ 
    mkdir -p /data && \
    chown -R redis:redis /data

#Copy Redis config.
COPY conf/redis.conf /etc/redis/redis.conf

#Expose Redis PORT
EXPOSE 6379

#Run the script for the setup
CMD ["redis-server", "/etc/redis/redis.conf"]