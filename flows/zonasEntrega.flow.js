const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

/*
* Flujo horarios
*/

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer(
[
  "Nuestro servicio abarca toda la colonia Villa Verde 🏘️",
  "El envio a otra colonia costaria 35 pesos extra 💰",
  "Puedes escribir *inicio* para ver mas opciones 🔙"
], { delay: 3000 }
);
