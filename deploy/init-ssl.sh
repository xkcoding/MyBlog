#!/bin/bash
# SSL 证书初始化脚本
# 使用方法: ./init-ssl.sh your@email.com

set -e

EMAIL=${1:-"237497819@qq.com"}
DOMAIN="xkcoding.com"
WWW_DOMAIN="www.xkcoding.com"

echo "🔐 开始申请 SSL 证书..."
echo "   域名: $DOMAIN, $WWW_DOMAIN"
echo "   邮箱: $EMAIL"

# 创建临时 nginx 配置（仅 HTTP，用于证书验证）
cat > /tmp/nginx-temp.conf << 'EOF'
server {
    listen 80;
    server_name xkcoding.com www.xkcoding.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
EOF

# 停止现有容器
echo "⏹️  停止现有容器..."
docker stop myblog myblog-nginx myblog-certbot 2>/dev/null || true
docker rm myblog myblog-nginx myblog-certbot 2>/dev/null || true

# 创建必要目录
mkdir -p /opt/myblog/dist
mkdir -p /opt/myblog/certbot

# 启动临时 nginx（用于证书验证）
echo "🚀 启动临时 Nginx..."
docker run -d --name nginx-temp \
    -p 80:80 \
    -v /tmp/nginx-temp.conf:/etc/nginx/conf.d/default.conf:ro \
    -v /opt/myblog/dist:/var/www/html:ro \
    nginx:alpine

sleep 2

# 申请证书
echo "📜 申请 Let's Encrypt 证书..."
docker run --rm \
    -v /opt/myblog/certbot/etc:/etc/letsencrypt \
    -v /opt/myblog/certbot/var:/var/lib/letsencrypt \
    -v /opt/myblog/dist:/var/www/html \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "$WWW_DOMAIN"

# 停止临时 nginx
echo "⏹️  停止临时 Nginx..."
docker stop nginx-temp && docker rm nginx-temp

echo ""
echo "✅ SSL 证书申请成功！"
echo ""
echo "证书位置:"
echo "  - 证书: /opt/myblog/certbot/etc/live/$DOMAIN/fullchain.pem"
echo "  - 私钥: /opt/myblog/certbot/etc/live/$DOMAIN/privkey.pem"
echo ""
echo "下一步: 运行 GitHub Actions 工作流部署博客"
