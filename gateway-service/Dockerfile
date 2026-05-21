FROM node:18-slim
WORKDIR /usr/src/app

# Ensure OpenSSL is available for Prisma and other native libs
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --production

EXPOSE 3000
CMD ["node", "dist/main.js"]
