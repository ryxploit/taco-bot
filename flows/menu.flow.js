const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const pedidoFlow = require("./pedido.flow");
const inactividadFlow = require("./inactividad.flow");

/*
* Flujo menu
*/

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer([
  "☝️ Este es nuestro menú",
  "",
  "Escoge la opción deseada.",
  "",
  "1️⃣ *Realizar pedido* ",
  "0️⃣ *Volver a empezar* 🔙"
],
{
  media: "https://dash.hous.com.mx/images/menu_taqueria.jpg", 
  delay: 2000,
  capture: true,
  idle: 300000 // Configuración de tiempo de inactividad (3 minutos)
},
 async(ctx, { gotoFlow, fallBack, inRef }) => {
  if(ctx?.idleFallBack) {
    return gotoFlow(inactividadFlow); // Si hay inactividad, ir al flujo de inactividad
  }

  if(ctx.body === "1"){
    gotoFlow(pedidoFlow)
  }/*else if(ctx.body === "9"){
    gotoFlow(opcionesflow)
  }*/else if(ctx.body === "0"){
    //gotoFlow(pedidoFlow)
  } else {
     await fallBack('Porfavor escoje una opción correcta!');
  }
}
)

