const {
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const confirmarFlow = require('./confirmar.flow')
const inactividadFlow = require("./inactividad.flow");
const { PROMP } = require("../promp/promp");
const ChatGPTClass = require("../services/openai/chatgpt.class");

const chatGPT = new ChatGPTClass();

let contadorRespuestas = 0; // Inicializar el contador

/*
* Flujo pedido
*/

module.exports = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      "Estoy listo para tomar su pedido 📝",
      "",
      "¿Cual es su *orden*? 🌮 ",
      "",
      "*Ejemplo*: *3* tacos de tripa, *1* quesadilla de tripa y *un* vampiro de asada.",
      "",
      "Favor de especificar el *tipo de carne* (asada, tripa)"
    ],
    {
      media: "https://dash.hous.com.mx/images/menu_hectors_tacos.png",
      delay: 2000,
      capture: true,
      idle: 300000, // Configuración de tiempo de inactividad (5 minutos) 
    },
    async (ctx, { state, gotoFlow, endFlow }) => {
      try {
        //await chatGPT.handleMsgChatGPT(PROMP);
        if (ctx?.idleFallBack) {
          return gotoFlow(inactividadFlow); // Si hay inactividad, ir al flujo de inactividad
        }

        const pedidos = [];

        // Agregar el pedido actual al estado
         pedidos.push(ctx.body);
        await state.update({ pedidos });
      } catch (error) {
        console.error('Ocurrió un error con chatgpt:', error);
        await flowDynamic('Se ha producido un error, posiblemente porque solicitaste algo que no está en el menú. Te pedimos que lo intentes de nuevo, ingresando 0️⃣.');
        return endFlow();
      }
    })
  .addAnswer(
    "¿Agregar algo más al pedido? Indíquelo o escriba 3️⃣ para el resumen. *Si no responde en 2 min, vuelva a escribir*. Gracias.",
    {
      delay: 2000,
      capture: true,
      idle: 300000, // Configuración de tiempo de inactividad (3 minutos)
    },
    async (ctx, { state, fallBack, gotoFlow }) => {
      try {

        await chatGPT.handleMsgChatGPT(PROMP);

        if (ctx?.idleFallBack) {
          return gotoFlow(inactividadFlow);
        }

        if (ctx.body !== "1") {
          if (ctx.body !== "3") {

            if (ctx?.idleFallBack) {
              return gotoFlow(inactividadFlow);
            }

            // Obtener el estado actual de los pedidos
            const pedidos = state.get('pedidos') || [];

            // Agregar el pedido actual al estado
            pedidos.push(ctx.body);
            await state.update({ pedidos });

            return fallBack("¿Agregar algo más al pedido? Indíquelo o escriba 3️⃣ para el resumen. *Si no responde en 2 min, vuelva a escribir*. Gracias.");
          } else {

            if (ctx?.idleFallBack) {
              return gotoFlow(inactividadFlow);
            }

            const pedidos_1 = state.get('pedidos') || [];
            const pedidosFinal = pedidos_1.join(', ');

            let fallbackCount = state.get('fallbackCount') || 0;

            // Enviar el pedido completo a ChatGPT
            const pedidoCorregido = await chatGPT.handleMsgChatGPT(pedidosFinal);
            //console.log(pedidoCorregido);
            const messageFinal = procesarPedido(pedidoCorregido.text);

            function procesarPedido(pedidoCorregido) {
              // Expresión regular para encontrar el texto entre comillas dobles
              const regex = /"([^"]*)"/;
              const match = regex.exec(pedidoCorregido);
            
              if (!match || !match[1]) {
                return 'Se ha producido un error, posiblemente porque solicitaste algo que no está en el menú. Te pedimos que lo intentes de nuevo, ingresando 3️⃣.';
              }
            
              const pedidoString = match[1];
            
              // Ahora solo dividimos por comas dentro de las comillas dobles
              const elementos = pedidoString.split(', ');
            
              let total = 0;
              const resumen = [];
            
              elementos.forEach(elemento => {
                const partes = elemento.split(' ');
            
                const cantidad = parseInt(partes[0]);
                const tipoProducto = partes.slice(1, -2).join(' '); // Corregir aquí
                const tipoCarne = partes[partes.length - 2]; // Corregir aquí
                const precio = parseFloat(partes[partes.length - 1].replace('$', ''));
            
                const subtotal = precio;
                total += subtotal;
            
                resumen.push(`${cantidad} ${tipoProducto} ${tipoCarne ? 'de ' + tipoCarne : ''} $${subtotal.toFixed(2)}`);
              });
            
                const resumenFinal = `Pedido recibido con éxito.
-------------------------------- 

Tu pedido incluye:\n${resumen.map(line => line.trim().padEnd(30)).join('\n')}

TOTAL DE $${total.toFixed(2)} PESOS.

El tiempo estimado de entrega es de 30 a 50 minutos.

Escribe 1️⃣ para confirmar.`;

//console.log(resumenFinal);




              return resumenFinal;
            }

            fallbackCount++;
            await state.update({ fallbackCount });

            if (fallbackCount >= 10) {
              return fallBack("Has sobrepasado el límite de mensajes permitidos para realizar un pedido. Por favor, sé más específico y si tienes dudas o algún problema, puedes llamarnos para atenderte personalmente o puedes iniciar de nuevo escribiendo inicio.");
            } else {
              return fallBack(messageFinal);
            }
          }
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

