FROM node:18-alpine

WORKDIR /app

# Install OpenSSL for Prisma (required for ARM64 Alpine)
RUN apk add --no-cache libc6-compat openssl

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]

