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
    "Tu opinión es muy importante para nosotros y queremos conocerla para mejorar nuestro servicio.",
    { 
      delay: 2000,
      capture: true,
      idle: 300000, // Configuración de tiempo de inactividad (3 minutos)
     },
    async (ctx, { state, gotoFlow, inRef }) => {
        if (ctx?.idleFallBack) {
          return gotoFlow(inactividadFlow); // Si hay inactividad, ir al flujo de inactividad
        }
        await state.update({ sugerencia: ctx.body });
    }
)
.addAnswer([
  "*Gracias* por tus sugerencias, las tomaremos en cuenta para darte un mejor servicio 🤖",
  "",
  "Escribe 0️⃣ para volver al menú de inicio 🔙"],
  { delay: 2500 }
  );