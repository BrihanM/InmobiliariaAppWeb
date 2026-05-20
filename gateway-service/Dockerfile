FROM node:18-alpine
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
