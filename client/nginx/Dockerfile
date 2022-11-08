FROM nginx:1.21.0-alpine

RUN rm /etc/nginx/conf.d/*

# When building in image for prod usage change conf to prod.conf
COPY ./prod.conf /etc/nginx/conf.d/

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
