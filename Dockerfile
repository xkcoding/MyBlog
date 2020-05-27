FROM nginx:1.18.0
LABEL maintainer="xkcoding <237497819@qq.com>"

COPY public/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf