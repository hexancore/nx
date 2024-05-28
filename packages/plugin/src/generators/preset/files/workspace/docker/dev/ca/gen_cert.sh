#!/bin/bash
# Generate new cert
# Usage: bash docker/dev/ca/gen_cert.sh <name> [p12|pfx]

cd ./docker/dev/ca

CA_DIR="./"
CA_KEY="${CA_DIR}/ca.key"
CA_CRT="${CA_DIR}/ca.crt"

name=$1
extra_export=${2:-}
cert_dir="certs/$name"

if [ -d "$cert_dir" ]; then
  rm -fr "$cert_dir"
fi
mkdir "$cert_dir"

key_file="$cert_dir/${name}.key"
csr_file="$cert_dir/${name}.csr"
crt_file="$cert_dir/${name}.crt"

# Generating a private key for the server
openssl genpkey -algorithm RSA -aes256 -out "$key_file"

# Generating a certificate request (CSR) for the server
openssl req -new -key "$key_file" -out "$csr_file"

# Signing of the server certificate by the CA
openssl x509 -req -days 365 -in "$csr_file" -CA "$CA_CRT" -CAkey "$CA_KEY" -CAcreateserial -out "$crt_file"
rm "$csr_file"

if [ "$extra_export" == 'p12' ]; then
  openssl pkcs12 -export -in "$crt_file" -inkey "$key_file" -certfile "$CA_CRT" -out "${cert_dir}/${name}.p12"
fi

# .pfx is same as p12
if [ "$extra_export" == 'pfx' ]; then
  openssl pkcs12 -export -in "$crt_file" -inkey "$key_file" -certfile "$CA_CRT" -out "${cert_dir}/${name}.pfx"
fi
