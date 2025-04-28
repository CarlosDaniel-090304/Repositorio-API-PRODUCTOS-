# --- Stage 1: Build ---
# Usa una imagen oficial de Node.js como base. Elige una versión LTS.
# Usar 'alpine' resulta en imágenes más pequeñas.
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json (si existe)
# Copiarlos por separado aprovecha el caché de Docker si no cambian
COPY package*.json ./

# Instala las dependencias de producción
# 'npm ci' es generalmente preferido en CI/CD porque usa package-lock.json
# para instalaciones exactas y es más rápido que 'npm install'.
# Si no tienes package-lock.json, usa 'npm install --only=production'
RUN npm ci --only=production

# Copia el resto del código de la aplicación
COPY . .

# --- Stage 2: Production ---
# Usa una imagen base de Node.js más ligera para producción
FROM node:18-alpine

# Establece el directorio de trabajo igual que en el builder
WORKDIR /usr/src/app

# Copia las dependencias instaladas y el código desde el stage 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

# Expone el puerto en el que la aplicación se ejecutará dentro del contenedor
# Tu app usa process.env.PORT || 3000, así que exponemos 3000 como default.
# Puedes sobrescribir el puerto con la variable de entorno PORT al ejecutar.
EXPOSE 3000

# Variable de entorno para asegurar que Node se ejecute en modo producción
ENV NODE_ENV=production

# Comando para ejecutar la aplicación cuando el contenedor inicie
# Usa 'node server.js' directamente
CMD [ "node", "server.js" ]

# Nota importante sobre MONGODB_URI:
# NO incluyas MONGODB_URI directamente en el Dockerfile o en un .env copiado.
# Deberás pasarla como variable de entorno al EJECUTAR el contenedor.