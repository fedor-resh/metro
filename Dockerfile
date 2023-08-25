# Base Node Image
FROM node:14 as build-stage

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build  # assuming this is the webpack build command

# Nginx Stage
FROM nginx:alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html  # assuming /app/dist is the folder where webpack outputs built files
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# docker build -t my-webpack-nginx-image .
 #docker run -p 80:80 my-webpack-nginx-image