FROM node:lts-bookworm

# Install system dependencies
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000

# Run using pm2-runtime (Heroku prefers this for Docker)
CMD ["npx", "pm2-runtime", "index.js", "--name", "JOEL-XMD-BOT"]
