# --- Dockerfile para la API ---

# 1. Imagen Base: Elige una imagen oficial de Node.js.
#    Se recomienda usar una versión LTS (Long Term Support) como 16, 18 o 20.
#    Usemos la versión 16 que tenías en tu ejemplo.
FROM node:16

# 2. Directorio de Trabajo: Crea y establece un directorio para la aplicación dentro del contenedor.
WORKDIR /app

# 3. Copiar Dependencias: Copia primero los archivos de definición de paquetes.
#    Esto optimiza el caché de Docker. Si estos archivos no cambian,
#    Docker reutilizará la capa de 'npm install' en builds futuras, acelerando el proceso.
COPY package*.json ./

# 4. Instalar Dependencias: Ejecuta npm install para descargar los paquetes necesarios.
#    Para producción, podrías considerar 'npm ci --only=production' si tienes un package-lock.json.
RUN npm install

# 5. Copiar Código Fuente: Copia el resto del código de tu API al directorio de trabajo.
#    Si tienes archivos que NO quieres copiar (como node_modules local, .env, .git),
#    puedes crear un archivo .dockerignore para excluirlos.
COPY . .

# 6. Exponer Puerto: Informa a Docker que el contenedor escuchará en este puerto.
#    Debe coincidir con el puerto interno que usa tu API (y el que mapeas en docker-compose.yml).
EXPOSE 3000

# 7. Comando de Inicio: Especifica cómo iniciar tu aplicación.
#    Asegúrate de que 'server.js' sea el archivo de entrada principal de tu API.
#    Si usas un script 'start' en tu package.json, podrías usar: CMD [ "npm", "start" ]
CMD [ "node", "server.js" ]