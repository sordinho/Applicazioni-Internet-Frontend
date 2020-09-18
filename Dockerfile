# 1 build angular application using node container
FROM node:alpine As appBuilder

WORKDIR usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod


# 2 push application to nginx container
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

#COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=appBuilder /usr/src/app/dist/Applicazioni-Internet-Frontend/ /usr/share/nginx/html
