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
.addAnswer("🕜 Nuestro Horario es: ", { delay: 3000, })
.addAnswer(
["Lunes a Viernes",
"De 6:00 - 10:00 PM"],
{ delay: 3000, }
)
.addAnswer("Puedes escribir *inicio* para ver mas opciones 🔙", { delay: 3000, });