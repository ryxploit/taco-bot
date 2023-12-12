function normalizarNombre(item) {
  // Convierte a minúsculas y elimina la 's' final
  return item.toLowerCase().replace(/s$/, '');
}

function palabraANumero(palabra) {
  const numeros = {
    'uno': 1,
    'dos': 2,
    'tres': 3,
    'cuatro': 4,
    'cinco': 5,
    // Agrega más según sea necesario
  };

  return numeros[palabra.toLowerCase()] || parseInt(palabra, 10) || 0;
}

function calcularCosto(item, cantidad) {
  const precios = {
    'taco': 33,
    'quesadilla': 60,
    'chorreada': 60,
    'vampiro': 50,
    'taco de harina': 50,
    'orden de carne': 260,
    '1/2 orden': 170,
    'agua chica': 20,
    'litro de agua': 30,
    'refresco vidrio': 20,
    'refresco 600mil': 30,
    'cebolla asada': 0,
    'chiles': 0,
    'cebollita': 0
  };

  const nombreNormalizado = normalizarNombre(item);

  if (!precios.hasOwnProperty(nombreNormalizado)) {
    throw new Error(`Artículo no reconocido: ${item}`);
  }

  return precios[nombreNormalizado] * cantidad;
}

function generarCorreccion(pedido) {
  const articulos = pedido.match(/(\d+|\b(?:uno|dos|tres|cuatro|cinco)\b)\s*(tacos?|quesadillas?|chorreadas?|vampiros?|tacos? de harina|ordenes? de carne|1\/2 orden|agua chica|litro de agua|refresco vidrio|refresco 600mil|cebolla asada|chiles|cebollita)\s*(de asada|de tripa)?/g);

  if (!articulos) {
    throw new Error('Pedido no válido');
  }

  let correccion = [];
  let total = 0;

  articulos.forEach(articulo => {
    const [, cantidad, nombre, tipo] = articulo.match(/(\d+|\b(?:uno|dos|tres|cuatro|cinco)\b)\s*(tacos?|quesadillas?|chorreadas?|vampiros?|tacos? de harina|ordenes? de carne|1\/2 orden|agua chica|litro de agua|refresco vidrio|refresco 600mil|cebolla asada|chiles|cebollita)\s*(de asada|de tripa)?/);
    const cantidadNumerica = palabraANumero(cantidad);
    const costo = calcularCosto(nombre, cantidadNumerica);
    total += costo;
    correccion.push(`${cantidadNumerica} ${nombre}${tipo ? ` ${tipo}` : ''} $${costo}`);
  });

  return {
    correccion: correccion.join(', '),
    total: total
  };
}


module.exports = { generarCorreccion }

/*
const pedido = "Quisiera dos quesadillas de asada y cuatro tacos de harina de tripa.";
try {
  const resultado = generarCorreccion(pedido);
  console.log(`Corrección del pedido: ${resultado.correccion}, Total: $${resultado.total}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
*/
