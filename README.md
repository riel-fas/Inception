# Inception 🋠

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Alpine Linux](https://img.shields.io/badge/Alpine_Linux-%230D597F.svg?style=for-the-badge&logo=alpine-linux&logoColor=white)](https://alpinelinux.org/)
[![NGINX](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![WordPress](https://img.shields.io/badge/WordPress-%23117AC9.svg?style=for-the-badge&logo=WordPress&logoColor=white)](https://wordpress.org/)
[![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org/)

> A 42 school system administration project that broadens knowledge of Docker and containerization by recreating a small, production-like web infrastructure from scratch.

---

## 📖 About

This project sets up a complete multi-service web infrastructure using **Docker Compose**, where every container is built from a custom `Dockerfile` based on **Alpine Linux**. No pre-built images are used. The stack includes a secure NGINX reverse proxy (TLS only), a WordPress/PHP-FPM application server, a MariaDB database backend, and several bonus services.

---

## 🗏 Architecture Overview

All containers communicate over a dedicated bridge network (`inception_network`). Backend services are never directly exposed to the outside world — all traffic enters through NGINX on port 443.

```
                        [ Internet ]
                             |
                        Port 443 (HTTPS)
                             |
                       ┌─────▼──────┐
                       │   NGINX    │  ← TLS termination, reverse proxy
                       └─────┬──────┘
                             │ FastCGI (port 9000)
                       ┌─────▼──────┐       ┌──────────┐
                       │ WordPress  │ ──────▶│  Redis   │  ← Object cache
                       │  PHP-FPM   │       └──────────┘
                       └─────┬──────┘
                             │ SQL (port 3306)
                       ┌─────▼──────┐
                       │  MariaDB   │
                       └────────────┘
```

| Service | Port(s) | Function | Volume |
|---|---|---|---|
| **NGINX** | `443` (HTTPS) | Reverse Proxy, TLS Termination | — |
| **WordPress** | `9000` (internal) | CMS, PHP-FPM Processor | `wordpress_data` |
| **MariaDB** | `3306` (internal) | Database Backend | `mariadb_data` |
| **Redis** | `6379` (internal) | Object Cache (Bonus) | — |
| **FTP** | `21`, `21000–21010` | File Transfer (Bonus) | `wordpress_data` |
| **Adminer** | `8080` (HTTP) | Web DB Management (Bonus) | — |
| **Redis Commander** | `8082` (HTTP) | Web Redis Management (Bonus) | — |
| **Static Site** | `3000` (HTTP) | Simple Showcase Site (Bonus) | — |

---

## 📂 File Structure

```text
Inception/
├── Makefile                # Command automation
├── srcs/
│   ├── docker-compose.yml  # Main orchestration file
│   ├── .env                # Secrets (NOT in git!)
│   └── requirements/
│       ├── mariadb/        # DB Service
│       ├── nginx/          # Web Server
│       ├── wordpress/      # CMS
│       └── bonus/
│           ├── adminer/
│           ├── ftp/
│           ├── redis/
│           ├── redis-commander/
│           └── static-site/
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose installed on a Linux VM.
- Add the following line to your `/etc/hosts` file:
  ```
  127.0.0.1 login.42.fr
  ```
- Create your `.env` file inside `srcs/` with your credentials (see `.env.example` if provided). **Never commit this file.**

### Commands

| Action | Command |
|---|---|
| **Build & Start** | `make` or `make up` |
| **Stop** | `make down` |
| **Clean Everything** | `make fclean` |
| **Rebuild** | `make re` |
| **View Logs** | `make logs` |
| **Check Status** | `docker compose -f srcs/docker-compose.yml ps` |

```bash
# Build and start the entire stack in detached mode
make

# View logs for a specific service
docker compose -f srcs/docker-compose.yml logs -f wordpress
```

Once running, access the services at:

- 🌐 **WordPress site** → `https://login.42.fr`
- 🗄️ **Adminer (DB UI)** → `http://login.42.fr:8080`
- 🔴 **Redis Commander** → `http://login.42.fr:8082`
- 📄 **Static Site** → `http://login.42.fr:3000`

---

## 🛠️ Implementation Details

### NGINX — The Gatekeeper

NGINX is the **only entry point** to the infrastructure. It handles TLS termination and forwards PHP requests to the WordPress container via FastCGI.

- Listens exclusively on port **443 (HTTPS)**.
- Uses a **self-signed SSL certificate** generated via `openssl` at build time.
- Enforces **TLS v1.2 / v1.3** only.
- Proxies dynamic PHP requests to the `wordpress` container on port **9000**.

### WordPress + PHP-FPM

WordPress is the CMS, served by PHP-FPM (FastCGI Process Manager) for high performance.

- A setup script automatically installs WordPress via `wp-cli`, creates users, and configures the Redis cache plugin.
- PHP memory limit is raised to `256M` for heavy operations.

How a request flows:
1. User requests `https://login.42.fr`
2. **NGINX** receives and decrypts the HTTPS traffic.
3. PHP requests are passed to **WordPress/PHP-FPM** on port 9000.
4. PHP-FPM executes the code, queries **MariaDB** (or reads from **Redis** cache).
5. The resulting HTML is returned through **NGINX** to the user.

### MariaDB — The Database

MariaDB (a MySQL fork) stores all WordPress data: users, posts, comments, and settings.

- Remote root login is **disabled** for security.
- A dedicated user and password are created for WordPress access.
- Data is persisted to `/home/login/data/mariadb` on the host via a **Docker volume**, so it survives container restarts and rebuilds.

### Volumes & Persistence

Docker volumes map container directories to host paths, ensuring data outlives the containers:

| Volume | Host Path | Container Path |
|---|---|---|
| `mariadb_data` | `/home/login/data/mariadb` | `/var/lib/mysql` |
| `wordpress_data` | `/home/login/data/wordpress` | `/var/www/html` |

### Docker Network

All containers are isolated inside `inception_network` (a custom bridge network). They communicate by service name (DNS resolution), and none of the backend services (MariaDB, Redis) expose ports directly to the host.

---

## 🌟 Bonus Features

### ⚡ Redis — Object Cache
Redis caches WordPress database queries in memory. Without Redis, each page load can trigger ~20 database queries. With caching, repeated requests are served from RAM in microseconds.
- Configured as an **LRU (Least Recently Used)** cache with memory limits.
- Manageable via the Redis Commander web UI at `http://login.42.fr:8082`.

### 📂 FTP Server — vsftpd
Provides direct file access to the WordPress volume without needing SSH.
- Users are **chrooted** to the WordPress directory for security.
- Connect with FileZilla or `lftp`:
  ```bash
  lftp -u ftpuser,yourpassword ftp://login.42.fr
  ```

### 🗄️ Adminer — Web Database UI
A lightweight web-based database manager (alternative to phpMyAdmin).
- Access at `http://login.42.fr:8080`
- Login with your WordPress DB credentials to browse tables and run queries.

### 🔴 Redis Commander
A web UI for viewing and managing Redis keys in real time.
- Access at `http://login.42.fr:8082`

### 📄 Static Website
A simple HTML page served by a standalone NGINX container, demonstrating static content delivery separate from WordPress.
- Access at `http://login.42.fr:3000`

---

## 🧠 Key Concepts

### Containers vs. Virtual Machines

| | Virtual Machines | Containers |
|---|---|---|
| **Isolates** | Hardware | User Space (OS) |
| **Kernel** | Each VM has its own | Shared with host |
| **Boot time** | Minutes | Milliseconds |
| **Size** | GBs | MBs |

Containers use two core Linux kernel features for isolation:

- **Namespaces** — give each container its own view of the system (process tree, network stack, filesystem root).
- **Cgroups** — limit how much CPU and RAM a container can consume.

### Docker Image Layers

Every instruction in a `Dockerfile` creates a cached, read-only layer. When a container runs, a thin read-write layer is added on top. This means 10 containers sharing the same base image only store the image once on disk.

```
┌──────────────────────────┐
│  Container Layer (R/W)   │  ← Your changes while running
├──────────────────────────┤
│  Layer 3: App Code (R/O) │
├──────────────────────────┤
│  Layer 2: Nginx   (R/O)  │
├──────────────────────────┤
│  Layer 1: Alpine  (R/O)  │
└──────────────────────────┘
```

### PID 1 & the `exec` Pattern

PID 1 is the first process in a container — it must handle OS signals like `SIGTERM` to shut down gracefully. By ending entrypoint scripts with `exec <service>`, the service process itself becomes PID 1 (replacing the shell), ensuring correct signal handling. Using `tail -f /dev/null` as a workaround is **forbidden** by the project rules.
