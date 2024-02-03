const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/*
 * Flujo direccion
 */

module.exports = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "Lamentamos informarle que el proceso de pedido ha sido cancelado debido a la dificultad para encontrar los artículos en el menú, posiblemente debido a errores de ortografía o la falta de esos productos en nuestra oferta actual.",
    "",
    "Si desea, por favor, vuelva a escribir su pedido con la información correcta, o si lo prefiere, no dude en comunicarse al *6692380820* para obtener asistencia adicional.",
    "",
    "*¡Gracias!* por tu preferencia 🤖",
    "",
    "Escribe 0️⃣ para volver al menú de inicio 🔙",
  ],
  { delay: 3000 }, // idle: 180000 = 3 minutos
  async (_, { gotoFlow, endFlow, state }) => {
    await state.update({ pedidos: [] });
    // return endFlow();
    return gotoFlow(pedidoFlow);
  }
);
