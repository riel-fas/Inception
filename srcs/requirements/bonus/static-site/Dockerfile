FROM alpine:3.19

RUN apk update && apk add --no-cache nginx

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY www/ /var/www/html/

RUN mkdir -p /run/nginx

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
