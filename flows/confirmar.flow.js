const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const recogerPedidoFlow = require('../flows/recogerPedido.flow');
const inactividadFlow = require("./inactividad.flow");
const GoogleSheetService = require("../services/sheets/index");

const googelSheet = new GoogleSheetService(
"1sti2R3ku5UtEYosiWymnWJfvuzCxte3SE_5bAb_eETs"
);

/*
* Flujo horarios
*/

module.exports = addKeyword(EVENTS.ACTION)
.addAnswer([
  "¿Como será el tipo de entrega?",
  "",
  "Escoge la opción deseada.",
  "",
  "1️⃣ Servicio a *domicilio* 🏠",
  "2️⃣ *Recoger en establecimiento* 🛵",
  ""
],
{ 
  delay: 2500,
  capture: true,
  idle: 300000, // Configuración de tiempo de inactividad (3 minutos) 
},
async (ctx, { state, gotoFlow, inRef }) => {
  if(ctx?.idleFallBack) {
    return gotoFlow(inactividadFlow); // Si hay inactividad, ir al flujo de inactividad
  }

  if(ctx.body.trim() === '1'){
    state.update({ tipo_envio: 'Servicio a domicilio' });
  }else if(ctx.body.trim() === '2'){
    await state.update({ tipo_envio: 'Pasará a recoger el pedido' });
    await gotoFlow(recogerPedidoFlow);
  } else {
    state.update({ tipo_envio: ctx.body });
  }    
})
.addAnswer(
"Cuál es tu *nombre* y *apellido*? 📝",
{ 
  delay: 2500,
  capture: true,
  idle: 300000, // Configuración de tiempo de inactividad (3 minutos) 
},
async (ctx, { state, gotoFlow, inRef }) => {
  if(ctx?.idleFallBack) {
    return gotoFlow(inactividadFlow); // Si hay inactividad, ir al flujo de inactividad
  }

  const nombre = ctx.body
  await state.update({nombre: nombre})
})
.addAnswer(
"¿A que *domicilio* se enviará su pedido? 🏘️",
{ 
  delay: 2500,
  capture: true,
  idle: 300000, // Configuración de tiempo de inactividad (3 minutos) 
},
async (ctx, { state, gotoFlow, inRef }) => {
  if(ctx?.idleFallBack) {
    return gotoFlow(inactividadFlow); // Si hay inactividad, ir al flujo de inactividad
  }

  await state.update({ direccion: ctx.body });
})
.addAnswer([
"*¡Gracias!* por tu preferencia 🤖",
"",
"Escribe 0️⃣ para volver al menú de inicio 🔙"],
{ delay: 2500 },
async(_, { endFlow, state }) => {
  await state.update({ pedidos: [] });
  await endFlow();
 }
);