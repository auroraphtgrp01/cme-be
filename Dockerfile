FROM node:18-alpine

WORKDIR /app

COPY dist ./dist
COPY node_modules ./node_modules
COPY package*.json ./
COPY prisma /app/prisma

EXPOSE 3333

CMD ["node", "dist/main"]
