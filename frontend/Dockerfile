# -------------------------
# STAGE 1: BUILD
# -------------------------
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

# IMPORTANT: install ALL deps (not production only)
RUN npm install --no-audit --no-fund

COPY . .

# FIX permissions issue (IMPORTANT)
RUN chmod -R 755 node_modules/.bin

# build React app
RUN npm run build


# -------------------------
# STAGE 2: PRODUCTION (NGINX)
# -------------------------
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
