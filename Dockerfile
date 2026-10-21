FROM docker.io/node:24-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM docker.io/nginx:alpine

# Overwrites the stock default.conf. The quoted 'EOF' stops Docker from
# trying to expand $uri, $page and friends as build variables.
COPY <<'EOF' /etc/nginx/conf.d/default.conf
# Pick the file extension based on the Accept header.
# Browsers send text/html; curl and friends send */* and get plain text.
map $http_accept $variant_ext {
    default      "";
    ~*text/html  ".html";
}

# Normalize the request URI into a bare page name:
#   /                -> index
#   /index           -> index
#   /index.html      -> index
#   /portfolio       -> portfolio
#   /portfolio.html  -> portfolio
map $uri $page {
    /                                  index;
    ~^/(?<p>.+?)(?:\.html)?/?$         $p;
}

server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;

    # The response differs by Accept header, so tell caches about it
    add_header Vary Accept always;

    # Never serve dotfiles
    location ~ /\. {
        deny all;
    }

    # Assets are served as-is
    location ~* \.(?:css|js|mjs|map|json|xml|txt|webmanifest|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|otf|mp4|webm|pdf)$ {
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Everything else is a "page": html or plain text depending on Accept
    location / {
        default_type text/plain;
        charset utf-8;
        try_files /$page$variant_ext =404;
    }
}
EOF

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
