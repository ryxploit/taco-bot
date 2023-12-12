const {
  addKeyword,
  EVENTS,
  flowDynamic,
} = require("@bot-whatsapp/bot");

const confirmarFlow = require('./confirmar.flow');
const inactividadFlow = require("./inactividad.flow");
const { generarCorreccion } = require("../promp/ai-propia");

const IDLE_TIMEOUT = 300000; // 5 minutes
const FALBACK_LIMIT = 10;

let contadorRespuestas = 0;

module.exports = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["Estoy listo para tomar su pedido 📝", ""],
    {
      media: "https://dash.hous.com.mx/images/menu_hectors_tacos.png",
      delay: 2000,
      capture: true,
      idle: IDLE_TIMEOUT,
    },
    async (ctx, { state, gotoFlow, endFlow, flowDynamic }) => {
      try {
        // Llamada a la función obtenerCorreccion con el pedido del usuario
        //  await generarCorreccion(ctx.body);

        // Check for idle fallback and transition to inactividadFlow if necessary
        if (ctx?.idleFallBack) {
          return gotoFlow(inactividadFlow);
        }

        // Update the state with the user's order
        let pedidos = state.pedidos || [];
        pedidos.push(ctx.body);
        await state.update({ pedidos });

      } catch (error) {
        // Manejar errores, registrar detalles y proporcionar un mensaje amigable para el usuario
        console.error('Ocurrió un error con chatgpt:', error);

        // Usar flowDynamic para mostrar un mensaje de error
        await flowDynamic('error', error);

        // Finalizar el flujo actual
        return endFlow();
      }
    }
  )
  .addAnswer(
    "¿Agregar algo más al pedido? Indíquelo o escriba 3️⃣ para el resumen.",
    {
      capture: true,
      idle: IDLE_TIMEOUT,
    },
    async (ctx, { state, fallBack, gotoFlow }) => {
      try {
        if (ctx?.idleFallBack) {
          return gotoFlow(inactividadFlow);
        }

        if (ctx.body === "3") {
          const pedidos_1 = state.get('pedidos') || [];
          const pedidosFinal = pedidos_1.join(', ');

          console.log(pedidosFinal)

          let fallbackCount = state.get('fallbackCount') || 0;

          const pedidoCorregido = generarCorreccion(pedidosFinal);
         console.log(pedidoCorregido);   //Imprimir el arreglo completo usando console.table

          const messageFinal = procesarPedido(pedidoCorregido);

          function procesarPedido(pedidoCorregido) {
            try {
              const correccion = pedidoCorregido.correccion;
              const total = pedidoCorregido.total || 0;

              const resumenLineas = correccion.split(', ').map(item => {
                const match = item.match(/(\d+)\s+(tacos|quesadilla)\s+de\s+(asada|tripa)\s+\$(\d+)/i);
                if (match) {
                  const [_, cantidad, producto, ingrediente, precio] = match;
                  return `${cantidad} ${producto} de ${ingrediente} $${precio}`;
                } else {
                  // Manejar el formato incorrecto aquí, si es necesario
                  return 'Formato incorrecto';
                }
              }).join('\n');

              const formattedTotal = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total);

              const resumenFinal = `
Pedido recibido con éxito.
-------------------------------- 
Tu pedido incluye:
${resumenLineas}

Total de: ${formattedTotal}
El tiempo estimado de entrega es de 30 a 50 minutos.
Escribe 1️⃣ para confirmar.
    `;

              return resumenFinal;
            } catch (error) {
              console.error('Error procesando el pedido:', error);
              throw new Error('Ocurrió un error al procesar el pedido.');
            }
          }

          fallbackCount++;
          await state.update({ fallbackCount });

          if (fallbackCount >= FALBACK_LIMIT) {
            return fallBack("Has sobrepasado el límite de mensajes permitidos para realizar un pedido. Por favor, sé más específico y si tienes dudas o algún problema, puedes llamarnos para atenderte personalmente o puedes iniciar de nuevo escribiendo inicio.");
          } else {
            return fallBack(messageFinal);
          }
        } else if (ctx.body !== "1") {
          const pedidos = state.get('pedidos') || [];
          pedidos.push(ctx.body);
          await state.update({ pedidos });

          return fallBack("¿Agregar algo más al pedido? Indíquelo o escriba 3️⃣ para el resumen.");
        } else {
          return gotoFlow(confirmarFlow);
        }

      } catch (error) {
        console.error("Error:", error);
        await flowDynamic("Ocurrió un error. Por favor, inténtalo de nuevo más tarde.", { delay: 3000 });
        return endFlow();
      }
    },
    [confirmarFlow]
  );

