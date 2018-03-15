FROM golang:alpine AS b0
RUN apk add --no-cache ca-certificates
RUN echo http://mirror.yandex.ru/mirrors/alpine/v3.5/main > /etc/apk/repositories                                                                                                                                   
RUN echo http://mirror.yandex.ru/mirrors/alpine/v3.5/community >> /etc/apk/repositories
RUN go get github.com/sirupsen/logrus \
    github.com/gorilla/mux
RUN go get github.com/cuelabs/cuerpc \
    github.com/cuelabs/sptfy
COPY main.go ./tmp
RUN cd /tmp && go build -v -o cueclient

FROM alpine:3.6
WORKDIR /srv
COPY --from=b0 /tmp .
ENTRYPOINT ./cueclient
