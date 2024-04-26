# Etapa de construcción
FROM node:14 AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Compila la aplicación de React
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos compilados de la etapa de construcción a NGINX
COPY --from=builder /app/build /usr/share/nginx/html

# Configura el archivo de configuración de NGINX
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
