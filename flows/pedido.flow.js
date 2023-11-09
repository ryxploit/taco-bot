const {
  createBot,
  createProvider,
  createFlow,
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
    "*Ejemplo*: *3* tacos de tripa(sin verdura), *1* quesadilla de tripa y *un* vampiro de asada ,*procura hacerlo en un solo mensaje el pedido*.",
    "",
    "Favor de especificar el *tipo de carne* (asada, tripa)",
    "",
    "*Podemos tardar un poco en contestar por que una inteligencia artificial esta tomando su pedido*."
  ],
  { 
    media: "https://dash.hous.com.mx/images/menu_hectors_tacos.png",
    delay: 2500,
    capture: true,
    idle: 300000, // Configuración de tiempo de inactividad (5 minutos) 
  },
  async (ctx, { state, gotoFlow, inRef }) => {
    await chatGPT.handleMsgChatGPT(PROMP);
    if(ctx?.idleFallBack) {
      return gotoFlow(inactividadFlow); // Si hay inactividad, ir al flujo de inactividad
    }

    const pedidos = [];
  
    // Agregar el pedido actual al estado
    await pedidos.push(ctx.body);
    await state.update({ pedidos });
})
.addAnswer(
  "¿Desea agregar algo más a su pedido? Si es así, indíquelo; de lo contrario, escriba 3️⃣ para pedir el resumen.",
  { 
    delay: 2500,
    capture: true,
    idle: 300000, // Configuración de tiempo de inactividad (5 minutos) 
  },
  async (ctx, { state, gotoFlow, fallBack }) => {
    try {
      //const negocio = await database.obtenerNegocio();

      //console.log(menu);
      ///const idNegocio =  negocio[0].id;
      //await state.update({id_Negocio: idNegocio})

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
          state.update({ pedidos });
      
          await fallBack("¿Desea agregar algo más a su pedido? Si es así, indíquelo; de lo contrario, escriba 3️⃣ para pedir el resumen.");
        } else {

          if (ctx?.idleFallBack) {
            return gotoFlow(inactividadFlow);
          }

          const pedidos12 = state.get('pedidos') || [];
          const pedidosFinal = pedidos12.join(', ');

          console.log(pedidos12);
          console.log(pedidosFinal);
  
          let fallbackCount = state.get('fallbackCount') || 0;
  
          // Enviar el pedido completo a ChatGPT
          const response = await chatGPT.handleMsgChatGPT(pedidosFinal);
          const message = response.text;
  
          // Actualizar el estado con el mensaje de pedido recibido con éxito
          if (
            message.toLowerCase().includes('pedido recibido con éxito') ||
            message.toLowerCase().includes('pedido recibido con exito') ||
            message.toLowerCase().includes('pedido recibido')
          ) {
            contadorRespuestas++;
            state.update({ descripcion: message });
          }
          
            fallbackCount++;
            state.update({ fallbackCount });
  
            if (fallbackCount >= 10) {
              await fallBack("Has sobrepasado el límite de mensajes permitidos para realizar un pedido. Por favor, sé más específico y si tienes dudas o algún problema, puedes llamarnos para atenderte personalmente o puedes iniciar de nuevo escribiendo inicio.");
            } else {
              await fallBack(message);
            }
        }
      } else {
        gotoFlow(confirmarFlow);
      }
    } catch (error) {
      console.error("Error:", error);
      await flowDynamic("Ocurrió un error. Por favor, inténtalo de nuevo escribiendo 0️⃣.", { delay: 3000 });
      await endFlow();
    }
  }
);

