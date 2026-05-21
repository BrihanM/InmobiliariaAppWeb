FROM node:20-slim
WORKDIR /app

# Ensure OpenSSL is available for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate || true
RUN npm run build
RUN npm prune --production
CMD ["node", "dist/src/main.js"]
