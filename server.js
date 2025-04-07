const app = require("./src/app");
require('dotenv').config();

const PORT =  process.env.PORT || 3055;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('WSV eCommerce Exit Server Express');
    //notify.send(ping...)
  });
})

