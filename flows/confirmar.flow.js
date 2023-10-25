const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const recogerPedidoFlow = require('../flows/recogerPedido.flow');
const GoogleSheetService = require("../services/sheets/index");

const googelSheet = new GoogleSheetService(
"1sti2R3ku5UtEYosiWymnWJfvuzCxte3SE_5bAb_eETs"
);

/*
* Flujo horarios
*/

module.exports = addKeyword(EVENTS.ACTION /*##FLUJO_CONFIRMO_PEDIDO_PEDIDO_CONFIRMO_FLUJO## */)
.addAnswer('Tu pedido está casi listo, solo nos falta unos datos', { delay: 2000 })
.addAnswer('‼️FAVOR DE ESCRIBIR TUS DATOS CORRECTAMENTE YA QUE CON ESO NOS BASAREMOS PARA DARTE UNA MEJOR ATENCION, GRACIAS!‼️', { delay: 2000 })
.addAnswer([
"¿Como será el tipo de entrega?",
" ",
"Escoge la opción deseada",
" ",
"1️⃣ Envío a *domicilio* 🏠",
"2️⃣ *Pasar a recogerlo* al establecimiento 🛵",
" "
],
{ delay: 2500, capture: true },
async (ctx, { state, gotoFlow }) => {
  if(ctx.body.trim() === '1'){
    state.update({ envioPedido: 'Envío a domicilio' });
  }else if(ctx.body.trim() === '2'){
    state.update({ envioPedido: 'Pasará a recoger el pedido' });
    await gotoFlow(recogerPedidoFlow);
  } else {
    state.update({ envioPedido: ctx.body });
  }    
}
)
.addAnswer(
"¿Con cuanto vas a *pagar* 💵?",
{ delay: 2500, capture: true },
async (ctx, { state }) => {
  state.update({ montoPago: ctx.body });
}
)
.addAnswer(
"¿Cual es tu *nombre* y *apellido* 📝 ?",
{ delay: 2500, capture: true },
async (ctx, { state }) => {
  const nombre = ctx.body
  state.update({name: nombre})
}
)
.addAction(async (_, { state, flowDynamic }) => {
const currentState = state.getMyState()
return flowDynamic(`Un gusto atenderte el dia de hoy, ${currentState.name}`)
}
)
.addAnswer([
"Porfavor dime tu *Direccion completa* 🏘️ ", 
"a donde enviaremos tu pedido "],
{ delay: 2500, capture: true },
async (ctx, { state }) => {
  state.update({ direccion: ctx.body });
}
)
.addAction(async (_, { state, flowDynamic }) => {
const currentState = state.getMyState()
return flowDynamic(`Gracias por la informacion, ${currentState.name}`)
}
)
.addAnswer("Dame un momento, estoy creando tu pedido ⌛....", { delay: 3500 })
/*.addAnswer(["Detalles de tu pedido",
"------------------------------",
"Taqueria el pariente",
" ",
`${nombre}`],
{ delay: 3500 }
)*/
.addAnswer(
"Perfecto, tu pedido estará listo en aprox 30 a 50 min 👌",
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
}
)
.addAnswer(["Gracias por tu preferencia 🤖", 
" ",
"Escribe 0️⃣ para volver a empezar 🔙"],
{ delay: 2500 },
async({ endFlow }) => {
await endFlow();
}
);