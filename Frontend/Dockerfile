# Stage 1: Build the Angular app
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html
COPY --from=build-stage /app/dist/frontend/server /usr/share/nginx/html/server
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will run on
EXPOSE 80
