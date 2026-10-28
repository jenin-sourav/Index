# Production Deployment & Operations Manual
## Apex International School (AIS Dhaka)

---

## 1. Prerequisites & Environment Setup

- **Node.js:** v18.18+ or v20+ LTS (Tested on Node.js 24)
- **Database:** PostgreSQL 14+ (or self-contained SQLite for local/edge deployments)
- **SSL / TLS:** Valid certificate for HTTPS (Let's Encrypt / Cloudflare)

### Production `.env` Checklist
```bash
# Production Relational Database URL
DATABASE_URL="postgresql://ais_db_admin:YourSecurePasswordHere@db.apex-intl.internal:5432/ais_production?schema=public&sslmode=require"

# 64-character Cryptographically Random Secret
SESSION_SECRET="generate_with_openssl_rand_hex_64_minimum"

# Application Public Hostname
NEXT_PUBLIC_APP_URL="https://www.apex-intl.edu.bd"

# Institutional Configurations
NEXT_PUBLIC_SCHOOL_NAME="Apex International School, Dhaka"
NEXT_PUBLIC_SCHOOL_SHORT_NAME="AIS Dhaka"
NEXT_PUBLIC_TIMEZONE="Asia/Dhaka"
NEXT_PUBLIC_CURRENCY="BDT"
NEXT_PUBLIC_DEFAULT_LOCALE="en"
```

---

## 2. Standard Linux / Docker Deployment Procedure

### Step 1: Install Production Dependencies
```bash
npm ci --omit=dev
```

### Step 2: Database Migration & Schema Sync
```bash
npx prisma migrate deploy
# If establishing initial database with administrative bootstrap:
node prisma/seed.js
```

### Step 3: Compile Optimized Production Build
```bash
npm run build
```

### Step 4: Process Management (PM2)
```bash
npm install -g pm2
pm2 start npm --name "ais-dhaka" -- start
pm2 save
pm2 startup
```

---

## 3. Reverse Proxy (Nginx Configuration)

```nginx
server {
    listen 80;
    server_name apex-intl.edu.bd www.apex-intl.edu.bd;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name apex-intl.edu.bd www.apex-intl.edu.bd;

    ssl_certificate /etc/letsencrypt/live/apex-intl.edu.bd/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/apex-intl.edu.bd/privkey.pem;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
