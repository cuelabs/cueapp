FROM mhart/alpine-node AS build0
MAINTAINER 'llater'
RUN npm install create-react-app --global
WORKDIR /app
RUN create-react-app cueapp
RUN rm -rf cueapp/src/*
RUN rm -rf cueapp/public/*
COPY react/src/ cueapp/src/
COPY react/public cueapp/public/
WORKDIR /app/cueapp
RUN yarn run build

FROM golang:alpine AS build1
RUN echo http://mirror.yandex.ru/mirrors/alpine/v3.5/main > /etc/apk/repositories
RUN echo http://mirror.yandex.ru/mirrors/alpine/v3.5/community >> /etc/apk/repositories
RUN apk update && apk add --no-cache git ca-certificates
RUN go get github.com/sirupsen/logrus \
           github.com/gorilla/mux \
           github.com/lib/pq
ADD . /src
COPY --from=build0 /app/cueapp/build /src/assets
RUN cd /src && go build -v -o cueapp

FROM alpine:3.6
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=build1 /src/ /app/
ENTRYPOINT ./cueapp
