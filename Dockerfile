# Dockerfile

# 1. Builder Stage: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# 2. Runner Stage: Create the final, smaller image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
# ✅ CRUCIAL: Copy the prisma directory again for the runtime migrate command
COPY --from=builder /app/prisma ./prisma
# Copy the wait-for-it script
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# Expose the port
EXPOSE 3000

# The command to run the application will be taken from docker-compose.yml
# CMD ["npm", "start"]