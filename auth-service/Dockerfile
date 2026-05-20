FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm i --silent
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/main.js"]
