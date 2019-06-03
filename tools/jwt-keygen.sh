# generate private key
openssl genrsa -out generated/private.pem 2048
# extatract public key from it
openssl rsa -in generated/private.pem -pubout > generated/public.pem
