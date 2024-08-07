#!/bin/bash

# Navega al directorio de la aplicación
cd /var/app/current

# Reinicia los servicios de Docker
docker-compose down
docker-compose up -d
