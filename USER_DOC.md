# User Documentation

## Services Provided
The stack provides a complete web infrastructure composed of the following isolated services:
- **NGINX**: Secure entry point (web server) protecting the website.
- **WordPress**: The main content management website.
- **MariaDB**: The database storing WordPress data.
- **Redis**: An optimization cache to speed up WordPress.
- **FTP Server**: Allows file transfer to the specific WordPress folder.
- **Adminer**: A web interface to manage the MariaDB database.
- **Redis Commander**: A web interface to manage the Redis cache.
- **Static Site**: A simple showcase website.

## Start and Stop the Project
The project is controlled via simple `make` commands in the terminal at the root of the folder.

### Start
To build and start the entire stack:
```bash
make
```
*First launch may take a few minutes to build Docker images.*

### Stop
To stop all services and remove the containers (data is preserved):
```bash
make down
```

## Accessing the Website and Administration
Once the project is running, you can access the services via your browser:

| Service | URL | Description |
| :--- | :--- | :--- |
| **WordPress (Main Site)** | [https://riel-fas.42.fr](https://riel-fas.42.fr) | The primary website. Accept the self-signed certificate if prompted. |
| **Adminer** | [http://riel-fas.42.fr:8080](http://riel-fas.42.fr:8080) | Database management panel. Login with credentials found in `.env`. |
| **Redis Commander** | [http://riel-fas.42.fr:8082](http://riel-fas.42.fr:8082) | Redis cache management interface. |
| **Static Site** | [http://riel-fas.42.fr:3000](http://riel-fas.42.fr:3000) | A bonus static webpage. |

## Locate and Manage Credentials
Security credentials are **not** hardcoded in the documentation. You can find them in two locations:

1.  **Environment Variables (`srcs/.env`)**:
    Contains usernames and passwords for:
    - WordPress Admin (`WP_ADMIN_USER`, `WP_ADMIN_PASSWORD`)
    - Database User (`MYSQL_USER`, `MYSQL_PASSWORD`)
    - FTP User (`FTP_USER`, `FTP_PASSWORD`)

2.  **Secret Files (`secrets/`)**:
    Contains sensitive root passwords locally.

**Management**: To change a password, edit the `.env` file (or secret file) and restart the project using `make re`.

## Check Service Status
To verify that the services are running correctly:

1.  **Check Status**: Run the command:
    ```bash
    make status
    ```
    Ensure all containers listed (nginx, wordpress, mariadb, etc.) show a state of `Up`.

2.  **Check Logs**: If a service is not working or states `Exit`, check the logs:
    ```bash
    make logs
    ```
