# Stage 1: Builder
FROM node:23-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

RUN npm run docker-postinstall

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:23-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# 👇 Run Prisma generate in the production image
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/index.js"]
