const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    EVENTS
  } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheets/index");

const googelSheet = new GoogleSheetService(
  "1sti2R3ku5UtEYosiWymnWJfvuzCxte3SE_5bAb_eETs"
);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  /*
  * Flujo horarios
 */

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer(
    "Perfecto, ¿Cual es tu *nombre* y *apellido* 📝 con el que pasaras a recogerlo?",
    { delay: 2000, capture: true },
    async (ctx, { state }) => {
        const nombre = ctx.body.trim(); // Asegúrate de que el nombre se esté capturando correctamente
        await state.update({ name: nombre });
    }
)
.addAnswer("Tu pedido estará listo en aprox 30 a 50 min 👌", 
{ delay: 2500 },
  async (ctx, { state }) => {
    const currentState = state.getMyState();
    await googelSheet.saveOrder({
      fecha: new Date().toDateString(),
      telefono: ctx.from,
      nombre: currentState.name,
      pedido: currentState.pedido,
      envioPedido: currentState.envioPedido,
      montoPago: currentState.montoPago,
      direccion: currentState.direccion,
    })
  })
.addAnswer(["Gracias por tu preferencia 🤖", 
"Escribe 0️⃣ para volver a empezar 🔙"],
 { delay: 2500 },
 async({ endFlow }) => {
  await endFlow();
 }
);
