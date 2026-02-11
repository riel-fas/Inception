_This project has been created as part of the 42 curriculum by riel-fas._

# Inception

## Description
This project is a System Administration related project. It involves setting up a small infrastructure composed of different services using Docker Compose. The goal is to separate services into their own containers and manage them with a single `docker-compose.yml` file.

The infrastructure consists of:
- **NGINX**: A web server with TLSv1.2/v1.3 support.
- **WordPress**: A CMS running on PHP-FPM.
- **MariaDB**: A relational database management system.
- **Bonus Services**:
    - **Redis**: Cache for WordPress.
    - **FTP Server**: For file transfer.
    - **Adminer**: Database management interface.
    - **Redis Commander**: Redis management interface.
    - **Static Website**: A simple custom website.

## Technical Overview & Design Choices

### Docker and Architecture
We utilize **Docker** to containerize each service, ensuring isolation and reproducibility. **Docker Compose** orchestrates these containers, handling networking and startup order.

**Key Design Choices:**
- **Alpine Linux**: All images are based on Alpine Linux (where possible) for improved security and minimal footprint.
- **Separation of Concerns**: Each service runs in its own container (Microservices architecture).
- **Custom Images**: We build custom Docker images rather than using pre-configured official ones to understand the configuration process deep-down.

### Comparisons

#### Virtual Machines vs Docker
| Feature | Virtual Machines (VM) | Docker Containers |
| :--- | :--- | :--- |
| **Architecture** | Emulates full hardware; runs complete OS. | Virtualizes OS; shares host kernel. |
| **Resources** | Heavy; high overhead (RAM/CPU). | Lightweight; low overhead. |
| **Startup** | Slow (minutes). | Fast (seconds). |
| **Isolation** | High (hardware level). | Moderate (process level). |

#### Secrets vs Environment Variables
- **Environment Variables**: passing sensitive data via variables (e.g., `MYSQL_ROOT_PASSWORD`) is convenient but insecure. They are visible in `docker inspect` and process listings.
- **Secrets**: Docker Secrets store sensitive data in files mounted at runtime (usually in `/run/secrets/`). This project uses a hybrid approach or specific secret files in `secrets/` to mimic best practices where applicable, prioritizing security.

#### Docker Network vs Host Network
- **Docker Network**: Creates an isolated virtual network (bridge). Containers can talk to each other by name (DNS) without exposing ports to the outside world unless explicitly mapped. This is the default and preferred method for security and organization.
- **Host Network**: The container shares the host's networking namespace. It’s faster (no NAT) but less secure and causes port conflicts easily. We use **Docker Networks** (`inception_network`) to isolate our stack.

#### Docker Volumes vs Bind Mounts
- **Docker Volumes**: Managed by Docker, stored in `/var/lib/docker/volumes/`. Easier to manage via CLI but harder to access directly from the host filesystem.
- **Bind Mounts**: Maps a specific host directory to a container path. We use **Bind Mounts** to store database and website data in `/home/riel-fas/data/`. This makes it explicit where data lives on the host and ensures it persists even if Docker is reset.

## Instructions

### Prerequisites
- Docker
- Docker Compose
- Make

### Setup
1.  Clone the repository.
2.  Ensure the data directories exist (handled by Makefile usually, or create `/home/riel-fas/data/mariadb` and `/home/riel-fas/data/wordpress`).
3.  Add `riel-fas.42.fr` to your `/etc/hosts` pointing to `127.0.0.1`.

### Commands
- `make`: Build and start the infrastructure.
- `make down`: Stop the containers.
- `make clean`: Stop and remove containers and networks.
- `make fclean`: Remove all data volumes as well.

## Resources
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NGINX Documentation](https://nginx.org/en/docs/)
- [WordPress Docker](https://hub.docker.com/_/wordpress)
- [MariaDB Docker](https://hub.docker.com/_/mariadb)

### AI Usage
AI tools were used to assist in explaining concepts and debugging complexe bugs and errors