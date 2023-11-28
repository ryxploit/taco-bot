const {
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

/*
* Flujo horarios
*/

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer([
  "Nuestro servicio abarca toda la colonia Villa Verde 🏘️",
  "",
  "El envio a otra colonia costaria *$35.00* pesos extra 💰",
  "",
  "Escribe 0️⃣ para volver al menú de inicio 🔙"], 
  { delay: 3000 },
   async(_, { endFlow }) => {
    return endFlow();
   }
);
