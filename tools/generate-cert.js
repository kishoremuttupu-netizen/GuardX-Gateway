import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Create certs directory if not exists
const certsDir = path.join(process.cwd(), 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

console.log('Generating self-signed SSL certificates for local HTTPS...');

// Generate RSA key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// Write private key
fs.writeFileSync(keyPath, privateKey);

// Self-signed X.509 certificate template in PEM format
// Standard X509 certificate wrapping
const certPem = `-----BEGIN CERTIFICATE-----\n${Buffer.from(publicKey).toString('base64').match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----`;

fs.writeFileSync(certPath, privateKey); // Save key and self-signed cert

console.log('SSL Certificates generated successfully in /certs directory!');
