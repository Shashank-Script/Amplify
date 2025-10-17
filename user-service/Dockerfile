FROM node:22-alpine3.21 AS builder

WORKDIR /build

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

FROM node:22-alpine3.21 AS runner

WORKDIR /app

COPY --from=builder /build/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /build/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
