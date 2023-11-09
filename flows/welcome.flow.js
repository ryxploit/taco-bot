const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

//const moment = require('moment')

const menuFlow = require('./menu.flow')
const pedidoFlow = require('./pedido.flow')
const confirmarFlow = require('./confirmar.flow')
const horariosFlow = require('./horarios.flow')
const zonasEntregaFlow = require('./zonasEntrega.flow')
const direccionFlow = require('./direccion.flow');
const sugerenciasFlow = require("./sugerencias.flow");
const inactividadFlow = require("./inactividad.flow");

/*
* Flujo Inicio
*/

module.exports = addKeyword(EVENTS.WELCOME/*['Buenas noches', 'buenas noches', 'hola', 'Hola', 'Buenas', 'buenas', '0'], { sensitive: true }*/)
.addAction(async (_, { flowDynamic, endFlow }) => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 para Domingo, 1 para Lunes, etc.
  
  console.log(`La hora actual es: ${hour}`);
  
  if ((day === 0) || (hour < 0 || hour >= 24)) {
      await flowDynamic("Estamos fuera de nuestro horario de atención.", { delay: 3000 });
      await flowDynamic("Nuestro horario es de Lunes a Sábado, de 8:00 AM a 10:00 PM.", { delay: 3000 });
      await flowDynamic("¡Esperamos verte durante ese tiempo! Vuelve luego, por favor.", { delay: 3000 });
      await endFlow();
  }
  })

.addAnswer([
    "*Bienvenido* a *Hectors Tacos* 🌮",
    "",
    "✨ Los del parque zaragoza ✨",
    "✨ El sabor de mazatlán desde 1980✨",
    "",
    "¿Cómo podemos ayudarte?",
    "",
    "1️⃣ Hacer un pedido 📝",
    "2️⃣ Ver horarios 🕔",
    "3️⃣ Zonas de entrega 🛵",
    "4️⃣ Dirección del local 🗺️",
    "5️⃣ Sugerencias 🗒️",
    "",
    "👉 Escribe solo el *número* de la opción deseada."
  ],
  {
    media: "https://dash.hous.com.mx/images/logo_hectors_tacos.png",
    delay: 3000,
    capture: true,
    idle: 300000
  },
  async (ctx, { fallBack, state, gotoFlow, flowDynamic, endFlow  }) => {
    await state.update({ message_user: ctx.body });

   // Verificamos si ha habido inactividad
   if (ctx?.idleFallBack) {
    return gotoFlow(inactividadFlow);
   }

    const currentState = state.getMyState();
    const Opcion_del_Usuario = currentState.message_user;

    switch (Opcion_del_Usuario) {
      case "1":
        gotoFlow(pedidoFlow);
        break;
      case "2":
        gotoFlow(horariosFlow);
        break;
      case "3":
        gotoFlow(zonasEntregaFlow);
        break;
      case "4":
        gotoFlow(direccionFlow);
        break;
      case "5":
        gotoFlow(sugerenciasFlow);
        break;
      default:
       await flowDynamic(
          "Opción no válida, por favor ingresa una de las 5 opciones 😊, Escribe 0️⃣ para volver al menú de inicio 🔙"
        )
        await endFlow();
    }
  }
);
