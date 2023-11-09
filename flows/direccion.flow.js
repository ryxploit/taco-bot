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
  "Estamos ubicados sobre Calle Guillermo Nelson 🌎",
  "",
  "esquina con Zaragoza (a un costado del parque Zaragoza) 🏘️",
  "",
  "*Presiona aqui* para indicaciones 👇",
  "https://maps.app.goo.gl/DcDZufomCUc7tBJU7",
  "",
  "Escribe 0️⃣ para volver al menú de inicio 🔙"], 
  { delay: 3000 },
   async(_, { endFlow }) => {
    await endFlow();
   }
);