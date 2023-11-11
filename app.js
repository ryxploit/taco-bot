const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const TwilioProvider = require('@bot-whatsapp/provider/twilio')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { createBotDialog } = require('@bot-whatsapp/contexts/dialogflowcx')



const main = async () => {
    const adapterDB = new MockAdapter()


    const adapterProvider = createProvider(TwilioProvider, {
        accountSid: 'AC7638649cfc7203b4811175ddfdcc1673',
        authToken: 'b1ab8df7c388a1c6f6f4af1117b4895a',
        vendorNumber: '+14155238886',
    })

    createBotDialog(
        {

            provider: adapterProvider,
            database: adapterDB,
        },
        {
            location: 'us-west1',
            agentId: 'ec9018a2-92ad-4c33-8f7c-b060875b7b32',
        }
    )
}

main()
