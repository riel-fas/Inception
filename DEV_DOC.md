# Developer Documentation

## File Structure
The project follows the mandatory structure:
```
Makefile
srcs/
  docker-compose.yml
  .env                  # Environment variables
  requirements/
    mariadb/
    nginx/
    wordpress/
    bonus/              # Bonus services
```

## Setup from Scratch

### Prerequisites
Before starting, ensure the following are installed on your machine:
- **Docker Engine** (v20.10+)
- **Docker Compose** (v2.0+)
- **Make**
- **Git**

### Installation Steps
1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd Inception
    ```
2.  **Environment Variables**:
    Create a `.env` file in `srcs/` (if not present). It must define all required variables (DOMAIN_NAME, MYSQL_*, WP_*, FTP_*).
3.  **Secrets**:
    Ensure the `secrets/` directory exists at the root and contains the necessary password files (e.g., `db_password.txt`, `db_root_password.txt`).
4.  **Host Config**:
    Add the domain to your `/etc/hosts`:
    ```bash
    127.0.0.1 riel-fas.42.fr
    ```
5.  **Directories**:
    The system maps data to specific host directories. Ensure `/home/riel-fas/data` exists or can be created by the Makefile.

## Build and Launch
The project is managed via a Makefile which wraps Docker Compose commands.

- **Build and Start**:
    ```bash
    make
    ```
    This command builds the Docker images (if not built) and starts the network of containers in detached mode.

- **Rebuild**:
    If you modify a Dockerfile or configuration, force a rebuild:
    ```bash
    make re
    ```

## Container & Volume Management
This section describes relevant commands to manage the lifecycle of the stack.

- **Stop Containers**:
    ```bash
    make down
    ```
    Stops and removes the containers and the internal generic network. Data volumes are preserved.

- **Clean Up (Containers & Images)**:
    ```bash
    make clean
    ```
    Stops containers and removes their associated images and networks.

- **Full Cleanup (Including Volumes)**:
    ```bash
    make fclean
    ```
    **Warning**: This deletes the persistent data stored in `/home/riel-fas/data/`. Use this to reset the project completely.

- **View Logs**:
    ```bash
    make logs
    ```

## Data Persistence
The project uses **Docker Bind Mounts** to persist data on the host machine. This ensures data survives container restarts or removal (`make down`).

**Storage Locations:**
- **Database**: `/home/riel-fas/data/mariadb` maps to `/var/lib/mysql` in the MariaDB container.
- **WordPress**: `/home/riel-fas/data/wordpress` maps to `/var/www/html` in the WordPress/NGINX containers.

Check `srcs/docker-compose.yml` for the specific volume definitions.

