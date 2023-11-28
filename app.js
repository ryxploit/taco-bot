require("dotenv").config();
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const welcomeFlow = require('./flows/welcome.flow')
const pedidoFlow = require("./flows/pedido.flow");
const confirmarFlow = require("./flows/confirmar.flow");
const zonasEntregaFlow = require("./flows/zonasEntrega.flow");
const direccionFlow = require("./flows/direccion.flow");
const recogerPedidoFlow = require("./flows/recogerPedido.flow");
const sugerenciasFlow = require("./flows/sugerencias.flow");
const inactividadFlow = require("./flows/inactividad.flow");



const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([
        welcomeFlow,
        pedidoFlow,
        confirmarFlow,
        zonasEntregaFlow,
        direccionFlow,
        recogerPedidoFlow,
        sugerenciasFlow,
        inactividadFlow
    ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
