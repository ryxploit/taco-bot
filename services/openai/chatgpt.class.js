require('dotenv').config()

class ChatGPTClass {
  queue = []; 
  optionsGPT = { model: "gpt-4-1106-preview" }; /* gpt-3.5-turbo-1106 gpt-4-1106-preview gpt-3.5-turbo-0301 gpt-3.5-turbo-16k gpt-3.5-turbo-instruct*/
  openai = undefined;

  constructor() {
    this.init().then();
  }

  /**
   * Esta funciona inicializa
   */
  init = async () => {
    try {
      const { ChatGPTAPI } = await import("chatgpt");
      this.openai = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.error("Error al inicializar ChatGPTAPI:", error);
    }
  };
  
  handleMsgChatGPT = async (body) => {
    try {
      const interaccionChatGPT = await this.openai.sendMessage(body, {
        conversationId: !this.queue.length
          ? undefined
          : this.queue[this.queue.length - 1].conversationId,
        parentMessageId: !this.queue.length
          ? undefined
          : this.queue[this.queue.length - 1].id,
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
