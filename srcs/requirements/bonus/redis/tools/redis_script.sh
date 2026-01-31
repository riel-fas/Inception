#!/bin/sh

# This script is a placeholder for any pre-launch logic 
# such as setting specific permissions or environment checks.

echo "Starting Redis on port 6379..."

# Execute the redis-server with our custom config
# 'exec' ensures Redis becomes PID 1, as required by the subject
exec redis-server /etc/redis/redis.conf