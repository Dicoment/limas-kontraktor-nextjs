const bcrypt = require('bcryptjs');

async function generate() {
  const passwordAsli = '$adminlimas';
  // Menggunakan bcryptjs bawaan proyekmu untuk hashing
  const hash = await bcrypt.hash(passwordAsli, 10);
  
  console.log('\n======================================================');
  console.log('INI STRING HASH BARU KAMU, COPY SEMUANYA:');
  console.log('======================================================\n');
  console.log(hash);
  console.log('\n======================================================\n');
}

generate();