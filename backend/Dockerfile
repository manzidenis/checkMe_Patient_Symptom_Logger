FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json tsconfig.build.json* nest-cli.json* ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app


COPY package.json package-lock.json* ./
RUN npm ci --omit=dev


COPY prisma ./prisma
RUN npx prisma generate


COPY --from=builder /app/dist ./dist


COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
