# Base image
FROM node:18-alpine

# App directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm install

# Copy rest of code
COPY . .

# Prisma config requires DATABASE_URL during client generation.
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/taskflow_db"

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
