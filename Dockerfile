FROM node:10-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /var/www

EXPOSE 80