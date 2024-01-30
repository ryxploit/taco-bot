function normalizarNombre(item) {
  return item.toLowerCase().replace(/s$/, "");
}

function palabraANumero(palabra) {
  const numeros = {
    uno: 1,
    un: 1,
    una: 1,
    dos: 2,
    tres: 3,
    cuatro: 4,
    cinco: 5,
    seis: 6,
    siete: 7,
    ocho: 8,
    nueve: 9,
    diez: 10,
    // Puedes añadir más números según sea necesario
  };

  return numeros[palabra.toLowerCase()] || parseInt(palabra, 10) || 0;
}

function normalizarNombre(item, cantidad) {
  const plural = cantidad > 1 ? "s" : "";
  return item.toLowerCase().replace(/s$/, "") + plural;
}

function calcularCosto(item, cantidad) {
  const precios = {
    taco: 34,
    "taco gerber": 34,
    quesadilla: 60,
    chorreada: 60,
    vampiro: 50,
    "taco de harina": 50,
    orden: 260,
    "media orden": 170,
    "agua chica": 20,
    litro: 30,
    refresco: 20,
    refresco: 30,
    "cebolla asada": 0,
    chiles: 0,
    cebollita: 0,
  };

  const nombreNormalizado = normalizarNombre(item);

  if (!precios.hasOwnProperty(nombreNormalizado)) {
    console.warn(`Advertencia: Artículo no reconocido - ${item}`);
    return 0; // Return 0 cost for unrecognized items
  }

  return precios[nombreNormalizado] * cantidad;
}

const sinonimos = {
  taco: ["tacos","tac","tako", "Tacos","Takos","takos","taquitos","tacuaches"],
  "taco gerber": [
    "tacos gerber",
    "gerber",
    "tacos para niño",
    "tacos papilla",
    "taco papilla",
    "taco cortado en tiritas",
    "taco para niños",
    "tacos para bebe",
  ],
  quesadilla: [
    "queso",
    "quesadillas",
    "Quezadilla",
    "Kezadilla",
    "Kesadilla",
    "kesadilla",
    "quecas",
    "quezadiyas"
  ],

  chorreada: ["chorreadas"],
  vampiro: ["vampiros", "Bampiro"],
  "taco de harina": [
    "tacos de harina",
    "Taco de arina",
    "Tako de harina",
    "Tako de arina",
    "Takos de harina",
  ],

  orden: [
    "orden de carne",
    "Horden d carne",
    "Horden d karne",
    "Horden de karne",
    "Orden d carne",
    "Orden d karne",
    "Orden de karne",
  ],

  "media orden": ["media orden de carne asada"],

  "agua chica": ["agua", "aguas"],

  litro: ["litros de agua", "listros"],

  refresco: [
    "refresco en vidrio",
    "gaseosa",
    "coquita",
    "cocon",
    "coquita de vidrio",
    "coka",
    "cokas",
    "coca",
    "cocas",
    "refrescos",
    "cococha",
    "soda",
  ],

  refresco: ["refrescos", "cocacola", "coca", "cocas"],
  "cebolla asada": [
    "cebollas asadas",
    "sebolla asada",
    "sebolla azada",
    "zebolla asada",
    "zebolla azada",
    "seboya asada",
    "seboya azada",
  ],

  chiles: ["chiles", "chilitos", "chilones", "chilez", "shilez", "shiles"],

  cebollita: ["cebollita", "cebollitas"],
};

function reconocerSinonimo(nombre) {
  for (const producto in sinonimos) {
    if (sinonimos[producto].includes(nombre.toLowerCase())) {
      return producto;
    }
  }
  return nombre;
}

function generarCorreccion(pedido) {
  const articulos = pedido.match(
    /(\d+|\b(?:uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b)\s*([a-záéíóúüñ]+)\s*(de asada|de tripa)?/gi
  );

  if (!articulos || articulos.length === 0) {
    console.warn("Advertencia: Pedido no válido");
    return { correccion: "", total: 0 }; // Devuelve una corrección vacía para pedidos no válidos
  }

  let correccion = [];
  let total = 0;

  articulos.forEach((articulo) => {
    const [, cantidad, nombre, tipo] = articulo.match(
      /(\d+|\b(?:uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b)\s*([a-záéíóúüñ]+)\s*(de asada|de tripa)?/i
    );
    const reconocido = reconocerSinonimo(nombre);
    const cantidadNumerica = palabraANumero(cantidad);
    const costo = calcularCosto(reconocido, cantidadNumerica);
    total += costo;
    correccion.push(
      `${cantidadNumerica} ${normalizarNombre(reconocido, cantidadNumerica)}${
        tipo ? ` ${tipo}` : ""
      } $${costo}`
    );
  });

  return {
    correccion: correccion.join(", "),
    total: total,
  };
}
// Ejemplo de uso:
/*const pedidoEjemplo = "2 tacos de asada, 1 quesadilla, 3 vampiros";
try {
  const resultado = generarCorreccion(pedidoEjemplo);
  console.log(resultado.correccion);
  console.log("Total: $" + resultado.total);
} catch (error) {
  console.error(error.message);
}*/

module.exports = { generarCorreccion };
