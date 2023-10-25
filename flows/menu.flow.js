const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const pedidoFlow = require("./pedido.flow");
const welcomeFlow = require('./welcome.flow')


/*
* Flujo menu
*/

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer("📩 Te estoy enviando el menú...", { delay: 2000})
.addAnswer(" ", {
  media:
    "https://dash.hous.com.mx/images/menu.png"
}, {delay: 2000})
.addAnswer("☝️ Este es nuestro menú", { delay: 5000 })
.addAnswer([
  "Escoge la opción deseada",
  " ",
  "1️⃣ *Realizar pedido* ",
  "0️⃣ *Volver a empezar* 🔙"
],
{ delay: 2000, capture: true },
 async(ctx, { gotoFlow, flowDynamic }) => {
  if(ctx.body === "1"){
    gotoFlow(pedidoFlow)
  }else if(ctx.body === "0"){
    //gotoFlow(pedidoFlow)
  } else {
    return flowDynamic('Porfavor escoje una opcion correcta!');
  }
}
)