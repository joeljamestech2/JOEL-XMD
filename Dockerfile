FROM node:lts-bookworm

# Install required dependencies
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  rm -rf /var/lib/apt/lists/*

# Copy package.json first (better caching)
COPY package.json .

# Install Node.js dependencies
RUN npm install && npm install -g qrcode-terminal pm2

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
