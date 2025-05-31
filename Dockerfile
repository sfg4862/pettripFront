# 1단계: React 앱 빌드
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 환경변수 설정 (선택)
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm run build

# 2단계: Nginx를 사용해 정적 파일 서빙
FROM nginx:alpine

# 커스텀 Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물 복사
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]