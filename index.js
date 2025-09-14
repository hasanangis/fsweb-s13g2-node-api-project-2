const server = require('./api/server');
const PORT = 9000;

server.listen(PORT, () => {
  console.log(`${PORT} numaralı port aktif olarak çalışıyor...`);
});