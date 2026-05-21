FROM node:20-bullseye-slim
RUN apt-get update && apt-get install -y openssl libssl1.1 ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx prisma generate || true
RUN npm run build
RUN npm prune --production
EXPOSE 4300
CMD ["node", "dist/src/main.js"]