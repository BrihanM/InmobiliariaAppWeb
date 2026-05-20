FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 4300
CMD ["node", "dist/src/main.js"]
