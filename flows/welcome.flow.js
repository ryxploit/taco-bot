const {
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const moment = require('moment')
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

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

module.exports = addKeyword(EVENTS.WELCOME)
  .addAction(async (_, { flowDynamic, endFlow }) => {
    const date = new Date();

    // formato fecha
    let optionsfe = {
      weekday: "long",
    };

    // formato hora
    optionsho = {
      hour: "numeric",
      timeZone: "America/Mazatlan",
    };
    var hora = new Intl.DateTimeFormat("es-MX", optionsho).format(date)
    var dia = new Intl.DateTimeFormat("es-MX", optionsfe).format(date)
    // console.log(hora);
    //console.log(dia);

    console.log(`La hora actual es: ${hora}`);

    if ((dia === "sabado") || (hora < 0 || hora >= 24)) {
      await flowDynamic("Estamos fuera de nuestro horario de atención.", { delay: 3000 });
      await flowDynamic("Nuestro horario es de Lunes a Sábado, de 8:00 AM a 10:00 PM.", { delay: 3000 });
      await flowDynamic("¡Esperamos verte durante ese tiempo! Vuelve luego, por favor.", { delay: 3000 });
      return endFlow();
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
      media: "https://dialogobot.hous.com.mx/logo_hectors_tacos.jpg",
      delay: 3000,
      capture: true,
      idle: 300000
    },
    async (ctx, { state, gotoFlow, flowDynamic, endFlow }) => {
      await state.update({ message_user: ctx.body });

      // Verificamos si ha habido inactividad
      if (ctx?.idleFallBack) {
        return gotoFlow(inactividadFlow); 
      }

      const currentState = state.getMyState();
      const Opcion_del_Usuario = currentState.message_user;

      switch (Opcion_del_Usuario) {
        case "1":
          return gotoFlow(pedidoFlow);
          break;
        case "2":
          return gotoFlow(horariosFlow);
          break;
        case "3":
          return gotoFlow(zonasEntregaFlow);
          break;
        case "4":
          return gotoFlow(direccionFlow);
          break;
        case "5":
          return gotoFlow(sugerenciasFlow);
          break;
        default:
          await flowDynamic(
            "Opción no válida, por favor ingresa una de las 5 opciones 😊, Escribe 0️⃣ para volver al menú de inicio 🔙"
          )
          return endFlow();
      }
    }
  );
