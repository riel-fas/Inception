#!/bin/bash

set -e

echo "Starting WordPress setup..."

# Wait for MariaDB to be ready
echo "Waiting for MariaDB to be ready..."
until mysqladmin ping -h"mariadb" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" --silent; do
    echo "MariaDB is unavailable - sleeping"
    sleep 2
done
echo "MariaDB is up and running!"

# Change to WordPress directory
cd /var/www/html

# Download WP-CLI if not exists
if [ ! -f /usr/local/bin/wp ]; then
    echo "Downloading WP-CLI..."
    wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -O /usr/local/bin/wp
    chmod +x /usr/local/bin/wp
fi

# Download WordPress if not exists
if [ ! -f wp-config.php ]; then
    echo "Downloading WordPress..."
    wp core download --allow-root
    
    echo "Creating wp-config.php..."
    wp config create \
        --dbname="${MYSQL_DATABASE}" \
        --dbuser="${MYSQL_USER}" \
        --dbpass="${MYSQL_PASSWORD}" \
        --dbhost="mariadb:3306" \
        --allow-root
    
    echo "Installing WordPress..."
    wp core install \
        --url="${WP_URL}" \
        --title="${WP_TITLE}" \
        --admin_user="${WP_ADMIN_USER}" \
        --admin_password="${WP_ADMIN_PASSWORD}" \
        --admin_email="${WP_ADMIN_EMAIL}" \
        --allow-root
    
    echo "Creating additional WordPress user..."
    wp user create \
        "${WP_USER}" \
        "${WP_USER_EMAIL}" \
        --role=editor \
        --user_pass="${WP_USER_PASSWORD}" \
        --allow-root
    
    echo "WordPress installation complete!"
else
    echo "WordPress is already installed."
fi

wp config set WP_REDIS_HOST redis  --allow-root --path=/var/www/html

wp config set WP_REDIS_PORT 6379 --raw --allow-root --path=/var/www/html


#  Install and Activate the Plugin
wp plugin install redis-cache --activate --allow-root  --path=/var/www/html


# Enable the Redis Object Cache
# This creates the necessary 'object-cache.php' file.
wp redis enable --allow-root  --path=/var/www/html


# Set correct permissions
chown -R nobody:nobody /var/www/html

echo "Starting PHP-FPM..."
exec php-fpm82 -F
