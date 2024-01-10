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
    "🕜 Horario de atención: ",
    "",
    "Miercoles a Lunes",
    "",
    "De *6:30 PM - 12:30 AM*",
    "",
    "El servicio a domicilio es de *7:00 PM a 11:30 PM*",
    "",
    "*Completamente Gratis*",
    "",
    "Escribe 0️⃣ para volver al menú de inicio 🔙"],
    { delay: 3000 },
    async (_, { endFlow }) => {
      return endFlow();
    }
  );