# -------------------------
# STAGE 1: BUILD
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# install ALL dependencies (IMPORTANT)
RUN npm install

COPY . .

# build React app (if CRA or Vite)
RUN npm run build


# -------------------------
# STAGE 2: PRODUCTION (Nginx)
# -------------------------
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
