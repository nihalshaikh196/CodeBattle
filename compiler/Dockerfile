FROM node:22-alpine
WORKDIR /app/compiler
RUN apk update && apk add --no-cache g++
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node","index.js"]
 
