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
.addAnswer([
  "Se canceló el proceso por inactividad",
  "",
  "Gracias por su preferencia 🔙"], 
  { delay: 3000 }, // idle: 180000 = 3 minutos
   async(_, { endFlow, state }) => {
    await state.update({ pedidos: [] });
    await endFlow();
   }
);