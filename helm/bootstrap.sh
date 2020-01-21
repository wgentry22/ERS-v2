#!/bin/sh

# Create application namespace
kubectl create namespace ers

# Create (Cluster) Role, (Cluster) Role Binding, and Service Account for Tiller
kubectl apply -f .tiller/

# Initialize Helm in Minikube
helm init --tiller-namespace ers --service-account tiller

# Set Docker context to use Minikube
eval "$(minikube docker-env)"

# Enable required Minikube addons
minikube addons enable ingress
minikube addons enable ingress-dns
minikube addons enable metrics-server

# Create kube-state-metrics server in kube-system namespace
kubectl apply -f https://raw.githubusercontent.com/gjeanmart/kauri-content/master/spring-boot-simple/k8s/kube-state-metrics.yml

# Build Application Container Images
docker build -t ers-server ../server/
docker build -t ers-client ../client/

