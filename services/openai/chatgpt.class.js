require('dotenv').config();

class ChatGPTClass {
  queue = [];
  optionsGPT = { model: "gpt-3.5-turbo" };
  openai = undefined;

  constructor() {
    this.init().then();
  }

  /**
   * Esta función inicializa la instancia de ChatGPTAPI.
   */
  init = async () => {
    try {
      const { ChatGPTAPI } = await import("chatgpt");
      this.openai = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.error("Error al inicializar ChatGPTAPI:", error);
      throw error; // Propaga el error para que pueda ser manejado por la aplicación.
    }
  };
  
  /**
   * Maneja el mensaje con ChatGPTAPI y actualiza la cola de conversación.
   * @param {Object} body - Cuerpo del mensaje.
   * @returns {Object} - Respuesta de ChatGPTAPI.
   */
  handleMsgChatGPT = async (body) => {
    try {
      const conversationId = this.queue.length ? this.queue[this.queue.length - 1].conversationId : undefined;
      const parentMessageId = this.queue.length ? this.queue[this.queue.length - 1].id : undefined;

      const interaccionChatGPT = await this.openai.sendMessage(body, {
        conversationId,
        parentMessageId,
      });

      this.queue.push(interaccionChatGPT);
      return interaccionChatGPT;
    } catch (error) {
      console.error("Error al enviar mensaje a ChatGPTAPI:", error);
      throw error; // Propaga el error para que pueda ser manejado por la aplicación.
    }
  };
}

module.exports = ChatGPTClass;
