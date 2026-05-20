FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 4300
CMD ["node", "dist/src/main.js"]
