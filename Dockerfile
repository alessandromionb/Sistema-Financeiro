FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY public /usr/share/nginx/html/public
COPY src /usr/share/nginx/html/src
EXPOSE 80
