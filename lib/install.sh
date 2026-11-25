#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   MEGA-MD WhatsApp Bot Installer  "
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (sudo bash install.sh)"
  exit 1
fi

# Install dependencies
echo "📦 Installing system dependencies..."
apt-get update -qq
apt-get install -y curl git ffmpeg libvips-dev build-essential libwebp-dev

# Install Node.js 20
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1 | tr -d 'v')" -lt 20 ]; then
  echo "📦 Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "✅ Node.js $(node -v) installed"

# Clone repo
echo "📥 Cloning MEGA-MD..."
git clone https://github.com/GlobalTechInfo/MEGA-MD /root/MEGA-MD
cd /root/MEGA-MD

# Install npm packages
echo "📦 Installing npm packages..."
npm install --legacy-peer-deps

# Setup data
echo "📁 Setting up data files..."
npm run reset-data

# Create .env
if [ ! -f .env ]; then
  cp sample.env .env
  echo ""
  echo "# Database (optional - use one):" >> .env
  echo "# MONGO_URL=" >> .env
  echo "# POSTGRES_URL=" >> .env
  echo "# MYSQL_URL=" >> .env
  echo "# DB_URL=" >> .env
  echo ""
  echo "⚠️  Please edit /root/MEGA-MD/.env with your settings"
  echo "   nano /root/MEGA-MD/.env"
fi

# PM2 setup
if ! command -v pm2 &> /dev/null; then
  echo "📦 Installing PM2..."
  npm install -g pm2
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Edit your config: nano /root/MEGA-MD/.env"
echo "  2. Start the bot:    cd /root/MEGA-MD && pm2 start index.js --name mega-md"
echo "  3. View logs:        pm2 logs mega-md"
echo "  4. Auto-start:       pm2 startup && pm2 save"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
