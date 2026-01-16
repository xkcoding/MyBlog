# 生产环境 Docker 镜像
# 使用 nginx:alpine 作为基础镜像，轻量且安全

FROM nginx:alpine

LABEL maintainer="xkcoding <237497819@qq.com>"
LABEL description="xkcoding's Blog - Built with Astro"

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
