#!/bin/sh
# 1) 런타임 .env에서 값을 읽어 config.js 생성
cat <<EOF > /usr/share/nginx/html/config.js
window.__CONFIG__ = {
  VITE_SERVER_ROUTE: "${VITE_SERVER_ROUTE}"
};
EOF
# 2) Nginx 실행
exec nginx -g 'daemon off;'