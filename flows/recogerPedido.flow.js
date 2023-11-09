const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    EVENTS
  } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheets/index");
const inactividadFlow = require("./inactividad.flow");

const googelSheet = new GoogleSheetService(
  "1sti2R3ku5UtEYosiWymnWJfvuzCxte3SE_5bAb_eETs"
);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  /*
  * Flujo horarios
 */

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer(
    "Perfecto, nombre y apellido quien recogerá el pedido 📝",
    { 
      delay: 2000,
      capture: true,
      idle: 300000, // Configuración de tiempo de inactividad (3 minutos) 
     },
    async (ctx, { state, gotoFlow, inRef }) => {
        if (ctx?.idleFallBack) {
          return gotoFlow(inactividadFlow); // Si hay inactividad, ir al flujo de inactividad
        }

        const nombre = ctx.body.trim(); // Asegúrate de que el nombre se esté capturando correctamente
        await state.update({ nombre: nombre });
    }
)
.addAnswer([
  "*¡Gracias!* por tu preferencia 🤖",
  "",
  "Escribe 0️⃣ para volver al menú de inicio 🔙"],
  { 
    delay: 2500
   },
   async(_, { endFlow, state }) => {
    await state.update({ pedidos: [] });
    await endFlow();
   }
  );