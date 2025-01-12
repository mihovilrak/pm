# Project Management App

A modern, full-stack project management application built with React, TypeScript, and Node.js. The application helps teams manage projects, track time, and collaborate effectively.

## 🚀 Features

- Project and task management
- Time tracking and logging
- User authentication and authorization
- Email notifications
- Modern, responsive UI built with Material-UI
- Interactive scheduling with DevExpress Scheduler
- Data visualization with Recharts

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Material-UI (MUI) v6
- DevExpress Scheduler
- Recharts for data visualization
- React Router for navigation
- Axios for API calls

### Backend
- Node.js
- TypeScript
- PostgreSQL 17
- Docker for containerization

### Services
- Notification service
- Email service (SMTP integration)

## 📦 Project Structure

```
project_management_app/
├── api/               # Backend API service
├── fe/                # Frontend React application
├── db/                # Database migrations and data
├── notification-service/ # Notification handling service
└── docker-compose.yml # Docker composition file
```

## 🚦 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Installation

1. Clone the repository
2. Create a `.env` file based on the provided example
3. Start the application using Docker:

```bash
./start-app.sh
```

Or manually:

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 💻 Development

### Frontend Development
```bash
cd fe
npm install
npm start
```

### Backend Development
```bash
cd api
npm install
npm run dev
```

## 🔒 Environment Variables

Key environment variables needed:
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `SESSION_SECRET`: Session encryption key
- `EMAIL_*`: Email service configuration
- `NODE_ENV`: Environment (development/production)

## 🐳 Docker

The application is containerized using Docker and includes:
- PostgreSQL database
- Node.js application server
- Frontend static file serving
- Notification service

### docker-compose.yml example:
```yaml
x-db: &db 
  POSTGRES_DB: pm_db
  POSTGRES_USER: pm_user
  POSTGRES_PASSWORD: pm_password

x-defaults: &defaults
  networks:
    - pm_network
  restart: always

services:
  db:
    <<: *defaults
    image: postgres:17.0-alpine3.20
    container_name: pm_db
    environment:
      <<: *db
      PGTZ: Europe/Zagreb
    volumes:
      - ./db/db_data:/var/lib/postgresql/data
      - ./db/backup:/backups
    ports:
      - "5432:5432"

  app:
    <<: *defaults
    image: pm:alpine
    container_name: pm_app
    environment:
      <<: *db
      POSTGRES_HOST: db
      NODE_ENV: production
      SESSION_SECRET: opensslgeneratedsessionsecret
      EMAIL_ENABLED: true
      EMAIL_HOST: smtp.gmail.com
      EMAIL_PORT: 587
      EMAIL_SECURE: false
      EMAIL_USER: some.email@gmail.com
      EMAIL_PASSWORD: apppassword
      EMAIL_FROM: Project Management <some.email@gmail.com>
      NOTIFICATION_RATE_LIMIT: 100
      LOG_LEVEL: info
    ports:
      - "3000:80"
      - "5000:5000"
    depends_on:
      - db

networks:
  pm_network:
    driver: bridge
```

## 📝 License

UNLICENSED - All rights reserved
