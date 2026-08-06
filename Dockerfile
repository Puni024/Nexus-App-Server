# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps (including dev deps needed for tsc)
COPY package*.json ./
RUN npm install --include=dev

# Copy source and compile TypeScript
COPY . .
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JS from the builder stage
COPY --from=builder /app/dist ./dist

# Render sets PORT automatically — your app must listen on process.env.PORT
EXPOSE 5000

CMD ["npm", "start"]