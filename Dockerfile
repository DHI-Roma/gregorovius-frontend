FROM node:22-alpine as build-stage-main
WORKDIR /app
COPY package*.json ./
RUN apk update && \
    apk add python3 make g++ && \
    npm install
COPY ./ .
RUN npx quasar build

FROM squidfunk/mkdocs-material:4.5.0 as build-stage-eddocs
WORKDIR /ed-docs
COPY ./edition-docs /ed-docs
RUN mkdocs build --clean


FROM nginx:stable-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage-main /app/dist/spa /app
RUN mkdir /edition-docs
COPY --from=build-stage-eddocs /ed-docs/site /edition-docs
COPY nginx.conf /etc/nginx/nginx.conf
