FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

# ---

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --only=production
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000 4001 4002 4003

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]