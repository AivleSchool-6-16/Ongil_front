# 1단계: Node로 React 앱 빌드
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: nginx로 정적 파일 서빙
FROM nginx:stable-alpine

# 1) React 빌드 결과물 복사
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# 2) entrypoint.sh 복사 및 실행 권한 부여
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 3) nginx 설정 덮어쓰기
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 4) 포트 개방 및 Nginx 시작
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]