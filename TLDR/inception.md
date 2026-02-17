# Inception — Complete Project Reference 🐋

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Alpine Linux](https://img.shields.io/badge/Alpine_Linux-%230D597F.svg?style=for-the-badge&logo=alpine-linux&logoColor=white)](https://alpinelinux.org/)

## 📖 About This Project

This project aims to broaden your knowledge of system administration by using Docker and Docker Compose. You will recreate a small infrastructure composed of different services following specific rules.

### Core Requirements
- **Docker Compose**: Orchestrates the entire stack.
- **Alpine Linux**: Base image for ALL containers (or Debian Buster). We use `alpine:3.19`.
- **Custom Images**: Build every image from a `Dockerfile`. No pulling ready-made images.
- **TLS v1.2/1.3**: Secure connection via port 443 only.
- **Volumes**: Data persistence for the database and website files.
- **Network**: A dedicated bridge network ensuring container isolation.

---

## 🏗️ Architecture Overview

The infrastructure consists of several containers running on a single dedicated Docker network (`inception_network`).

| Service | Port(s) | Function | Volume |
|---|---|---|---|
| **NGINX** | 443 (HTTPS) | Reverse Proxy, TLS Termination | — |
| **WordPress** | 9000 (Internal) | CMS, PHP-FPM Processor | `wordpress_data` |
| **MariaDB** | 3306 (Internal) | Database Backend | `mariadb_data` |
| **Redis** | 6379 (Internal) | Object Cache (Bonus) | — |
| **FTP** | 21, 21000-21010 | File Transfer (Bonus) | `wordpress_data` |
| **Adminer** | 8080 (HTTP) | Web Database Management (Bonus) | — |
| **Redis Commander** | 8082 (HTTP) | Web Redis Management (Bonus) | — |
| **Static Site** | 3000 (HTTP) | Simple Showcase Site (Bonus) | — |

---

## 🛠️ Implementation Details

### 1. NGINX (Entry Point)
- **Role**: The only entry point to your infrastructure.
- **Config**: Listens on port 443 with SSL/TLS.
- **SSL**: Self-signed certificate generated via `openssl` during build.
- **Routing**: Proxy_passes PHP requests to the `wordpress` container on port 9000.

### 2. WordPress + PHP-FPM
- **Role**: Runs the WordPress core code and processes PHP.
- **Efficiency**: Running PHP-FPM (FastCGI Process Manager) is much faster than traditional CGI.
- **Setup Script**: Automatically downloads `wp-cli`, installs WordPress, creates users, andconfigures the Redis cache plugin.
- **Memory Fix**: Configures PHP memory limit to 256M to handle heavy operations.

### 3. MariaDB (Database)
- **Role**: Stores all WordPress content (posts, users, comments).
- **Security**: Root login is disabled remotely. A dedicated user/password is created for WordPress.
- **Persistence**: Data is stored in a Docker volume mounted to `/home/login/data/mariadb`, ensuring it survives container restarts.

### 4. Docker Network
- **Isolation**: Containers communicate via service names (DNS) inside the `inception_network`.
- **Security**: Database and backend services are not exposed to the host machine, only reachable by other containers.

---

## 🌟 Bonus Features

### Redis (Object Cache)
- **Why**: Speeds up WordPress by caching database queries in memory.
- **Config**: Configured as an LRU (Least Recently Used) cache with strict memory limits.

### FTP Server (vsftpd)
- **Why**: Allows file management of the WordPress directory without SSH.
- **Access**: Restricted to the WordPress volume directory. Secure configuration (chrooted users).

### Adminer
- **Why**: Lightweight alternative to phpMyAdmin.
- **Usage**: Access via `http://login.42.fr:8080` to manage your MariaDB database visually.

### Redis Commander
- **Why**: Web interface to view and manage Redis keys.
- **Usage**: Access via `http://login.42.fr:8082`.

### Static Website
- **Why**: Demonstrates serving static content via a separate NGINX container.
- **Usage**: Access via `http://login.42.fr:3000`.

---

## 🚀 Usage Guide

### Prerequisites
- Docker & Docker Compose installed.
- Host machine: Linux VM.
- Domain setup: Add `127.0.0.1 login.42.fr` to `/etc/hosts`.

### Commands
Build and start the project in the background:
```bash
make
# or
docker compose -f srcs/docker-compose.yml up -d --build
```

Stop the project:
```bash
make down
```

Clean everything (Stop + Remove Images + Remove Volumes):
```bash
make fclean
```

View logs:
```bash
make logs
# or a specific service
docker compose -f srcs/docker-compose.yml logs -f wordpress
```

---

## 🛡️ Critical Points (Don't Forget!)

1.  **NO `.env` in Git**: Your `.env` file contains passwords. Ensure it is listed in `.gitignore`.
2.  **No `latest` Tags**: Always pin versions (e.g., `alpine:3.19`, not `alpine:latest`).
3.  **No Infinite Loops**: Use `exec` to let the main process take over PID 1. Never use `tail -f /dev/null`.
4.  **Restart Policy**: All containers must have `restart: unless-stopped` or `always` to handle crashes.
5.  **Bonus URLs**: Bonus web services (Adminer, etc.) are on HTTP, not HTTPS.

---

## 📂 File Structure

```text
Inception/
├── Makefile                # Command automation
├── srcs/
│   ├── docker-compose.yml  # Main orchestration file
│   ├── .env                # Secrets (NOT in git!)
│   ├── requirements/
│   │   ├── mariadb/        # DB Service
│   │   ├── nginx/          # Web Server
│   │   ├── wordpress/      # CMS
│   │   └── bonus/
│   │       ├── adminer/
│   │       ├── ftp/
│   │       ├── redis/
│   │       ├── redis-commander/
│   │       └── static-site/
└── README.md               # Quick start guide
```
