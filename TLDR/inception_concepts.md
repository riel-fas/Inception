# Inception Concepts Guide 🧠

A deep dive into the technologies and concepts used in this project.

## 🐳 Docker & Virtualization

### What is Docker?
Docker is a platform for developing, shipping, and running applications. It uses **containers** to package an application with all its dependencies (libraries, runtime, tools) so it runs effectively anywhere.

#### Containers vs. Virtual Machines (VMs)
- **VMs**: Virtualize the hardware. Each VM runs a full OS kernel (heavy, slow boot).
- **Containers**: Virtualize the OS. They share the host's Linux kernel but have their own filesystem (lightweight, instant boot).

### Docker Images & Layers
An **image** is a read-only template used to build containers. It is built from a `Dockerfile`.
- **Layers**: Each instruction in a Dockerfile (`RUN`, `COPY`) creates a layer. Docker caches these layers to speed up builds.
- **Base Image**: We use `alpine:3.19` because it is extremely small (~5MB) compared to `debian` (~120MB) or `ubuntu`, reducing attack surface and download time.

---

## 🐙 Docker Compose

Managing 6+ containers with individual `docker run` commands is painful. **Docker Compose** allows you to define your entire multi-container application in a single YAML file (`docker-compose.yml`).

- **Services**: Each container (nginx, wordpress, mariadb) is a "service".
- **Networks**: Compose automatically creates a shared network so services can reach each other by name (e.g., `ping mariadb` works from the `wordpress` container).
- **Volumes**: Defines shared storage that persists after containers stop.

---

## 🌐 NGINX (The Gatekeeper)

NGINX is a high-performance web server and **reverse proxy**.

### Why do we need it?
WordPress (PHP) cannot speak HTTP/HTTPS directly to the internet efficiently. NGINX handles the heavy lifting:
1.  **SSL/TLS Termination**: Decrypts HTTPS traffic on port 443.
2.  **Static Files**: Serves images/CSS/JS instantly.
3.  **Reverse Proxy**: Forwards dynamic PHP requests to the `wordpress` container on port 9000.

### Configuration Key Points
- **TLS v1.2/1.3**: Security protocols to encrypt traffic.
- **FastCGI**: The protocol NGINX uses to talk to the WordPress PHP processor.

---

## 📝 WordPress & PHP-FPM

**WordPress** is written in PHP.
**PHP-FPM** (FastCGI Process Manager) is a PHP handler highly optimized for heavy loads.

How a request works:
1.  User requests `https://login.42.fr`.
2.  **NGINX** receives it.
3.  If it's a PHP file, NGINX passes it to **WordPress** container via port 9000.
4.  **PHP-FPM** executes the code, queries the **MariaDB** database, and returns HTML.
5.  **NGINX** sends the HTML back to the user.

---

## 🗄️ MariaDB (The Database)

MariaDB is a fork of MySQL. It acts as the memory of your application, storing:
- User accounts (admin, editors)
- Blog posts and pages
- Comments
- Site settings

### Persistence (Volumes)
In Docker, if you delete a container, its filesystem is gone.
We map a **Volume** (`mariadb_data`) to `/var/lib/mysql` inside the container.
- **Host path**: `/home/login/data/mariadb`
- **Result**: Even if you `make down` and destroy the container, your database files remain safe on your host machine.

---

## ⚡ Redis (The Bonus Cache)

Redis is an in-memory data structure store.
- **Problem**: Every time you load a WordPress page, it queries the database ~20 times. This is slow.
- **Solution**: Redis saves the result of these queries in RAM.
- **Result**: The next time you load the page, it fetches data from Redis in microseconds, skipping the database entirely.

---

## 📂 FTP (File Transfer Protocol)

FTP allows you to upload/download files to your server.
We configured `vsftpd` (Very Secure FTP Daemon) to give access to the `/var/www/html` folder. this allows you to edit WordPress themes or plugins directly without using SSH or the WordPress interface.
