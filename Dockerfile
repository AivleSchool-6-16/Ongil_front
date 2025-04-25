FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


# 2단계: 빌드된 파일을 nginx로 서비스
FROM nginx:stable-alpine

# 빌드 결과 복사
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# nginx 기본 설정 덮어쓰기 (선택)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]