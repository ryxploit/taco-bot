require("dotenv").config();
const {
  createBot,
  createProvider,
  createFlow
} = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const welcomeFlow = require('./flows/welcome.flow')
//const menuFlow = require("./flows/menu.flow");
const pedidoFlow = require("./flows/pedido.flow");
const confirmarFlow = require("./flows/confirmar.flow");
const zonasEntregaFlow = require("./flows/zonasEntrega.flow");
const direccionFlow = require("./flows/direccion.flow");
const recogerPedidoFlow = require("./flows/recogerPedido.flow");
const sugerenciasFlow = require("./flows/sugerencias.flow");
const inactividadFlow = require("./flows/inactividad.flow");

/**
 * Flows
 * Los flows que ocupan inactividad son WELCOME, MENU, PEDIDO, CONFIRMAR, RECOGERPEDIDO, SUGERENCIAS
 * los flows que no ocupan inactividad son DIRECCION, HORARIOS, ZONAS DE ENTREGA
 */

/**
 * Declaramos las conexiones de MySQL
 */
/*const MYSQL_DB_HOST = '68.178.245.248'
const MYSQL_DB_USER = 'botuser'
const MYSQL_DB_PASSWORD = 'DialogoBot'
const MYSQL_DB_NAME = 'bot'
const MYSQL_DB_PORT = '3306'*/

const main = async () => {
  const adapterDB = new MockAdapter()

  const adapterFlow = createFlow([
    welcomeFlow, 
    //menuFlow, 
    pedidoFlow, 
    confirmarFlow, 
    zonasEntregaFlow, 
    direccionFlow,
    recogerPedidoFlow,
    sugerenciasFlow,
    inactividadFlow
  ]);

  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  }/*,
  {
      queue: {
          timeout: 180000,
          concurrencyLimit: 15,
      },
  }*/);

  QRPortalWeb();
};

main();
