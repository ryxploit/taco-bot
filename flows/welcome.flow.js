const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const menuFlow = require('./menu.flow')
const pedidoFlow = require('./pedido.flow')
const confirmarFlow = require('./confirmar.flow')
const horariosFlow = require('./horarios.flow')
const zonasEntregaFlow = require('./zonasEntrega.flow')
const direccionFlow = require('./direccion.flow')

/*
* Flujo Inicio
*/

module.exports = addKeyword(['inicio', '0'], { sensitive: true })
.addAction(async ({ flowDynamic, endFlow }) => {
const now = new Date();
const hour = now.getHours();
const day = now.getDay(); // 0 para Domingo, 1 para Lunes, etc.

console.log(`La hora actual es: ${hour}`);

if ((day === 2) || (hour < 0 || hour >= 24)) {
    await flowDynamic("Estamos fuera de nuestro horario de atención.", { delay: 3000 });
    await flowDynamic("Nuestro horario es de Lunes a Sábado, de 8:00 AM a 10:00 PM.", { delay: 3000 });
    await flowDynamic("¡Esperamos verte durante ese tiempo! Vuelve luego, por favor.", { delay: 3000 });
    await endFlow();
}
})
.addAnswer(" ", {
media:
  "https://dash.hous.com.mx/images/portada.png"
})
.addAnswer(
[
  "Bivenido a *Taqueria El Pariente* 🤠",
  "",
  "✨ Los mejores tacos a los mejores precios ✨"
], { delay: 3000 }
)
.addAnswer([
"¿Como podemos ayudarte?",
"",
"*1️⃣* Ver Menú  🗒️",
"*2️⃣* Hacer un pedido  📝",
"*3️⃣* Ver horarios 🕔",
"*4️⃣* Zonas de entrega 🛵",
"*5️⃣* Ver direccion del local 🗺️",
], { delay: 3000 })
.addAnswer("👉 Escribe solo el *numero* de la opcion deseada.",
  { delay: 3000, capture: true}, 
  async (ctx, { fallBack, state, gotoFlow }) => {
    //Creamos un stado de la respuesta del usuario
    state.update({ message_user: ctx.body });
    const currentState = state.getMyState();
    const Opcion_del_Usuario = currentState.message_user;

    switch (Opcion_del_Usuario) {
      case "1":
        //Redirigimos al flowAgendarCita
        gotoFlow(menuFlow);
        break;
      case "2":
        //Redirigimos al flowPreguntasFrecuentes
        gotoFlow(pedidoFlow);
        break;
      case "3":
        //Redirigimos al flowContactarALuis
        gotoFlow(horariosFlow);
        break;
      case "4":
          //Redirigimos al flowContactarALuis
          gotoFlow(zonasEntregaFlow);
          break;
      case "5":
          //Redirigimos al flowContactarALuis
          gotoFlow(direccionFlow);
          break;
      case "6":
          //Redirigimos al flowContactarALuis
          gotoFlow(flujoPrueba);
          break;
      default:
        //Si no elegie ninguna de las opciones retorna el fallback
        return fallBack(
          "Opción no válida, por favor ingresa una de las 5 opciones 😊"
        );
    }
  }
);