# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (needed before build)
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only the necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Run Prisma migrations automatically on container start
CMD npx prisma migrate deploy && npm start

EXPOSE 3000
