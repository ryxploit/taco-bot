const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

/*
* Flujo direccion
*/

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer(
[
  "Estamos ubicados sobre la av las americas 🌎",
  "Colonia Villa Verde, #4002 🏘️",
  "Puedes escribir *inicio* para ver mas opciones 🔙"
], { delay: 3000 }
);