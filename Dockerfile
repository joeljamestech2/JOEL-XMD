FROM node:lts-bookworm

# Install system dependencies
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

EXPOSE 3000

# Run using pm2-runtime (best for Docker)
CMD ["npx", "pm2-runtime", "index.js", "--name", "JOEL-XMD-BOT"]
