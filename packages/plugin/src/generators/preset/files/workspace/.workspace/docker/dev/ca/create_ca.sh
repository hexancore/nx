#!/bin/bash

# Generowanie klucza prywatnego dla CA
openssl genpkey -algorithm RSA -out ca.key

# Generowanie certyfikatu podpisanego przez CA
openssl req -new -x509 -days 365 -key ca.key -out ca.crt

# Tworzenie katalogu dla certyfikatów
mkdir certs

echo "Done"