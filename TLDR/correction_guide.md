# Inception Defense Guide 🛡️

**Status:** ✅ Ready for Defense (except `.gitignore`!)

> [!CAUTION]
> **CRITICAL FIX NEEDED BEFORE DEFENSE:**
> Your `.gitignore` has all lines commented out. **You MUST uncomment** the lines for `.env` and `secrets/` or you will fail immediately.
> Run this now: `nano .gitignore` and remove `#` before `secrets/` and `srcs/.env`.

---

## 🚀 Quick Commands
| Action | Command |
|---|---|
| **Start Project** | `make` (or `make up`) |
| **Stop Project** | `make down` |
| **Clean Everything** | `make fclean` (removes images & volumes!) |
| **Rebuild** | `make re` |
| **Check Logs** | `make logs` |
| **Check Status** | `docker compose -f srcs/docker-compose.yml ps` |

---

## 📝 Defense Checklist (Step-by-Step)

### 1. Preliminaries
- [ ] **Git Clone:** Clone your repo into an empty directory.
- [ ] **Check Files:** `ls -R` to show `srcs/`, `Makefile`, `docker-compose.yml`.
- [ ] **Check Env:** Show that `.env` is **NOT** in the repo (it should be allowed only on the defense machine).
- [ ] **Cleanup:** Run `docker system prune -a --volumes` (or your `make fclean` + manual docker clean) to prove you start fresh.

### 2. Docker & Compose
- [ ] **Build:** Run `make`. Watch it build.
- [ ] **No Crashes:** Verify all containers are "Up" or "Healthy".
- [ ] **Explain:** "Docker Compose orchestrates the containers. My `Makefile` wraps the `docker compose` commands."
- [ ] **Images:** Run `docker images`. Show they are built from **Alpine/Debian** (e.g., `mariadb:1`, `wordpress:1`).
- [ ] **Network:** Run `docker network ls`. Show `inception_network`.

### 3. NGINX (SSL/TLS)
- [ ] **Port Check:** Try accessing `http://login.42.fr` (should fail or redirect).
- [ ] **HTTPS Check:** Access `https://login.42.fr`.
- [ ] **Certificate:** Show the "Not Secure" warning -> Certificate details. It should be **TLS v1.2** or **v1.3**.
- [ ] **Explanation:** "I generate a self-signed certificate in the Dockerfile using `openssl`. NGINX is configured to only accept SSL on port 443."

### 4. WordPress & MariaDB
- [ ] **Volume Check:** Run `docker volume ls`. Show `wordpress_data` and `mariadb_data`.
- [ ] **Persistence Test:**
    1. Create a post or comment in WordPress.
    2. Run `make down` (stop containers).
    3. Run `make up` (start again).
    4. Check if the post/comment is still there. (It should be!)
- [ ] **Database Check:**
    - Access Adminer (`http://login.42.fr:8080`).
    - Login with `wpuser` / `wpuser_strong_password_123` (from your .env).
    - Show that the database `wordpress` exists and has tables.

### 5. Bonus Part
- [ ] **Redis:**
    - Show `redis` container is running.
    - Explain: "It's an object cache for WordPress. I installed the Redis plugin in WordPress."
    - Check: go to WordPress Admin -> Settings -> Redis to see it connected.
- [ ] **FTP:**
    - Connect using FileZilla or `lftp`: `lftp -u ftpusername,ftp_strong_password_123 ftp://login.42.fr`.
    - Upload a file. Check if it appears in `/home/login/data/wordpress` on the host (or inside the WordPress container).
- [ ] **Adminer:**
    - Show `http://login.42.fr:8080`. It allows managing the DB via web UI.
- [ ] **Redis Commander:**
    - Show `http://login.42.fr:8082`. It's a web UI to view Redis keys.
- [ ] **Static Site:**
    - Show `http://login.42.fr:3000`. Simple HTML page served by a separate NGINX container.

---

## 🗣️ Common Defense Questions

**Q: Why Docker Compose?**
A: It allows defining and running multi-container Docker applications. Instead of running 6 separate `docker run` commands with complex flags, I define everything in one YAML file.

**Q: What is PID 1?**
A: PID 1 is the first process started in a container. It must handle signals (like `SIGTERM`) to stop the container gracefully. I use `exec` in my entrypoint scripts (e.g., `exec nginx ...`) so that the service itself becomes PID 1, replacing the shell script.

**Q: How do volumes work?**
A: Volumes persist data outside the container's lifecycle. Even if I delete the container, the data remains in `/home/login/data/...` on the host machine.

**Q: Why use a custom network?**
A: To isolate my containers. They can talk to each other by service name (dns) inside the `inception_network`, but they are not exposed to the outside world unless I map ports (like 443).
