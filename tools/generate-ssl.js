import selfsigned from 'selfsigned';
import fs from 'fs';
import path from 'path';

const certsDir = path.join(process.cwd(), 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

console.log('Generating SSL Certificates...');
const attrs = [{ name: 'commonName', value: '10.60.3.106' }];
const pwa = await selfsigned.generate(attrs, { days: 365 });

console.log('Keys:', Object.keys(pwa));
fs.writeFileSync(path.join(certsDir, 'key.pem'), pwa.private);
fs.writeFileSync(path.join(certsDir, 'cert.pem'), pwa.cert);
console.log('SSL Certificates generated successfully in /certs!');
