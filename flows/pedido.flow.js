const { addKeyword, EVENTS, flowDynamic } = require("@bot-whatsapp/bot");

const confirmarFlow = require("./confirmar.flow");
const inactividadFlow = require("./inactividad.flow");
const cancelacionFlow = require("./cancelacion.flow");
const { generarCorreccion } = require("../AI/AI");

const IDLE_TIMEOUT = 300000; // 5 minutes
const FALBACK_LIMIT = 10;

module.exports = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      "Estoy listo para tomar su pedido 📝",
      "",
      "¿Cual es su *orden*? 🌮 ",
      "",
      "*Ejemplo*: *3* tacos de tripa, *1* quesadilla de tripa y *un* vampiro de asada.",
      "",
      "Favor de especificar el *tipo de carne* (asada, tripa)",
    ],
    {
      media: "https://dialogobot.hous.com.mx/menu_hectors_tacos.jpg",
      delay: 2000,
      capture: true,
      idle: IDLE_TIMEOUT,
    },
    async (ctx, { state, gotoFlow }) => {
      try {
        if (ctx?.idleFallBack) {
          return gotoFlow(inactividadFlow);
        }

        let pedidos = state.pedidos || [];
        pedidos.push(ctx.body);
        await state.update({ pedidos });
      } catch (error) {
        console.error("Ocurrió un error con chatgpt:", error);
        await flowDynamic("error", error);
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
          const pedidosFinal = (state.get("pedidos") || []).join(", ");
          console.log(pedidosFinal);

          let fallbackCount = state.get("fallbackCount") || 0;
          const pedidoCorregido = generarCorreccion(pedidosFinal);
          console.log(pedidoCorregido);

          const messageFinal = procesarPedido(pedidoCorregido);

          fallbackCount++;
          await state.update({ fallbackCount });

          if (fallbackCount >= FALBACK_LIMIT) {
            return fallBack(
              "Has sobrepasado el límite de mensajes permitidos para realizar un pedido. Por favor, sé más específico y si tienes dudas o algún problema, puedes llamarnos para atenderte personalmente o puedes iniciar de nuevo escribiendo inicio."
            );
          } else {
            return fallBack(messageFinal);
          }
        } else {
          const pedidos = state.get("pedidos") || [];
          pedidos.push(ctx.body);
          await state.update({ pedidos });

          if (ctx.body === "5") {
            return gotoFlow(cancelacionFlow);
          } else if (ctx.body === "1") {
            return gotoFlow(confirmarFlow);
          } else {
            return fallBack(
              "¿Agregar algo más al pedido? Indíquelo o escriba 3️⃣ para el resumen."
            );
          }
        }
      } catch (error) {
        console.error("Error:", error);
        await flowDynamic(
          "Ocurrió un error. Por favor, inténtalo de nuevo más tarde.",
          { delay: 3000 }
        );
        return endFlow();
      }
    },
    [confirmarFlow]
  );

function normalizarNombre(item, cantidad) {
  const plural = cantidad > 1 ? "s" : "";
  return item.toLowerCase().replace(/s$/, "") + plural;
}

function procesarPedido(pedidoCorregido) {
  try {
    const menu = {
      taco: 34,
      "taco gerber": 34,
      quesadilla: 60,
      chorreada: 60,
      vampiro: 50,
      "taco de harina": 50,
      orden: 260,
      "media orden": 170,
      "agua chica": 20,
      "litro de agua": 30,
      "refresco vidrio": 20,
      refresco: 30,
      "cebolla asada": 0,
      chiles: 0,
      cebollita: 0,
    };

    const correccion = pedidoCorregido.correccion.toLowerCase();
    const resumenLineas = correccion
      .split(", ")
      .map((item) => {
        for (let producto in menu) {
          if (item.includes(producto)) {
            const cantidad = item.match(
              /(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)/
            )[1];
            const tipoCarne = item.match(/(asada|tripa|pollo)/)
              ? item.match(/(asada|tripa|pollo)/)[1]
              : "";
            const precio = menu[producto] * cantidad;
            const nombreNormalizado = normalizarNombre(producto, cantidad);
            return `${cantidad} ${nombreNormalizado} ${
              tipoCarne ? "de " + tipoCarne : ""
            } $${precio}`;
          }
        }

        return "Pedido incorrecto";
      })
      .join("\n");

    const total = resumenLineas.split("\n").reduce((sum, line) => {
      const price = line.match(/\$(\d+)/);
      return sum + (price ? Number(price[1]) : 0);
    }, 0);

    const formattedTotal = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(total);

    const resumenFinal = `Pedido recibido con éxito.
-------------------------------- 
Tu pedido incluye:
${resumenLineas}
          
Total de: ${formattedTotal}
El tiempo estimado de entrega es de 30 a 50 minutos.
si deseas agregar algo mas solo escribelo
*Escribe 1️⃣ para confirmar* o *escriba 5️⃣ si le salió pedido incorrecto*.`;

    return resumenFinal;
  } catch (error) {
    console.error("Error procesando el pedido:", error);
    throw new Error("Ocurrió un error al procesar el pedido.");
  }
}
