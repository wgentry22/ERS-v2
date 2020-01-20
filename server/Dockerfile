FROM golang:latest AS builder

# Download and install the latest release of dep
ADD https://github.com/golang/dep/releases/download/v0.5.4/dep-linux-amd64 /usr/bin/dep
RUN chmod +x /usr/bin/dep

# Copy the code from the host and compile it
WORKDIR $GOPATH/src/github.com/wgentry2/ers-ngrx/server
COPY Gopkg.toml Gopkg.lock ./
RUN dep ensure --vendor-only
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix nocgo -o /ers .

FROM scratch
COPY --from=builder /ers ./
ENTRYPOINT ["./ers"]
