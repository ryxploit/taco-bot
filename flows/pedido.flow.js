const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const confirmarFlow = require('./confirmar.flow')
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
  "📩 Estoy listo para tomar su pedido",
  " ",
  "¿Cual es su *orden*? 🌮 ",
], { delay: 1000 }, async () => {
  await chatGPT.handleMsgChatGPT(PROMP)
  }
)
.addAnswer([
  "*Ejemplo*: 2 tacos de asada, 1 papa loca de asada y",
  "dos chorreadas de asada."] /*"Puedes escribir 0️⃣ para volver a empezar 🔙."*/,
{ delay: 2000, capture: true },
async (ctx, { state, fallBack, gotoFlow }) => {
  let fallbackCount = state.get('fallbackCount') || 0; // Cambiado a 'let'
  const response = await chatGPT.handleMsgChatGPT(ctx.body);
  const message = response.text;

  if (contadorRespuestas === 0) {
    state.update({ pedido: message });
    contadorRespuestas++;
  }

  if (ctx.body.trim() === '1') {
    // Si el cliente escribe '1', pasar directamente al flujo de confirmación
    gotoFlow(confirmarFlow);
  } else {
    fallbackCount++; // Ahora es una variable 'let'
    state.update({ fallbackCount });

    if (fallbackCount >= 5) {
      await fallBack("Has sobrepasado el límite de mensajes permitidos para realizar un pedido. Por favor, sé más específico y si tienes dudas o algún problema, puedes llamarnos para atenderte personalmente o puedes iniciar de nuevo escribiendo inicio.");
    } else {
      await fallBack(message);
    }
  }
},
[confirmarFlow]
)
