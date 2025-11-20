# Etapa 1: Build con Node (Angular 20)
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar solo lo necesario para instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la app en modo producción
RUN npm run build -- --configuration production

# Etapa 2: Servidor ligero con Nginx
FROM nginx:alpine

# Copiar los archivos compilados al directorio de Nginx
COPY --from=builder /dist/sakai-ng/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (opcional pero recomendado)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Nginx se inicia automáticamente
CMD ["nginx", "-g", "daemon off;"]