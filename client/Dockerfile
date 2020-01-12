FROM node:alpine as angular
COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm ci && mkdir /app && mv ./node_modules /app
WORKDIR /app
RUN npm install -g @angular/cli@8.3.12
COPY . .
RUN ng build --prod --aot --deployUrl=/client/ --baseHref=/client/

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=angular /app/dist/client /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
