# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем манифесты и ставим зависимости отдельным слоем для кэша
COPY package.json package-lock.json* ./
RUN npm ci

# ARG передаётся в vite build через переменную окружения VITE_*
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

ARG VITE_LOGTO_RESOURCE
ENV VITE_LOGTO_RESOURCE=${VITE_LOGTO_RESOURCE}

ARG VITE_LOGTO_ENDPOINT
ENV VITE_LOGTO_ENDPOINT=${VITE_LOGTO_ENDPOINT}

ARG VITE_LOGTO_APP_ID
ENV VITE_LOGTO_APP_ID=${VITE_LOGTO_APP_ID}

ARG VITE_APP_URL
ENV VITE_APP_URL=${VITE_APP_URL}

COPY . .
RUN npm run build

# Stage 2: serve static via nginx
FROM nginx:alpine

# Кастомный конфиг для SPA-роутинга
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Статика из стадии сборки
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost:80 || exit 1
