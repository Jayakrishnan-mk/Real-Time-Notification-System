# Stage 1: Build step
FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production
RUN npm install --save-dev @types/jsonwebtoken @types/morgan @types/swagger-ui-express @types/swagger-jsdoc  # Install types here

COPY . .
RUN npm run build

# Stage 2: Run step, Production
FROM node:23-slim

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm", "start"]
