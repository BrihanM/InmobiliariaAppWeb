FROM node:20-bullseye-slim
WORKDIR /usr/src/app

# Ensure OpenSSL is available for Prisma
RUN apt-get update && apt-get install -y openssl libssl1.1 ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm i --silent
COPY . .
RUN npx prisma generate || true
RUN npm run build
RUN npm prune --production || true
EXPOSE 4100
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
