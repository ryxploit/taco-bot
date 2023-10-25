require("dotenv").config();
const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS
} = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const welcomeFlow = require('./flows/welcome.flow')
const menuFlow = require("./flows/menu.flow");
const pedidoFlow = require("./flows/pedido.flow");
const confirmarFlow = require("./flows/confirmar.flow");
const zonasEntregaFlow = require("./flows/zonasEntrega.flow");
const direccionFlow = require("./flows/direccion.flow");
const recogerPedidoFlow = require("./flows/recogerPedido.flow");

/**
 * Flows
 */

const main = async () => {
  const adapterDB = new MockAdapter();

  const adapterFlow = createFlow([
    welcomeFlow, 
    menuFlow, 
    pedidoFlow, 
    confirmarFlow, 
    zonasEntregaFlow, 
    direccionFlow,
    recogerPedidoFlow
  ]);

  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
