# 1단계: 빌드
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# 빌드 아규먼트 정의
ARG VITE_SERVER_ROUTE
# 환경변수로 설정 (npm run build 시 import.meta.env에 주입)
ENV VITE_SERVER_ROUTE=${VITE_SERVER_ROUTE}

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: nginx로 서비스
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]