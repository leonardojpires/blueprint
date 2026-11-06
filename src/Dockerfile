# Stage 1: Install all dependencies
FROM node:26-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Stage 2: Build the application
FROM dependencies AS builder

COPY . .

RUN npm run build

# Stage 3: Install production dependencies
FROM node:26-alpine AS production-dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Stage 4: Final production image
FROM node:26-alpine AS production

WORKDIR /app

COPY --from=production-dependencies /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

COPY package.*json ./

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]