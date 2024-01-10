function normalizarNombre(item) {
  // Convierte a minúsculas y elimina la 's' final
  return item.toLowerCase().replace(/s$/, '');
}

function palabraANumero(palabra) {
  const numeros = {
    'uno': 1,
    'un': 1,
    'una': 1,
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
    'media orden': 170,
    'agua chica': 20,
    'litro de agua': 30,
    'refresco vidrio': 20,
    'refresco': 30,
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

// Añade sinónimos para reconocer diferentes nombres de productos
const sinonimos = {
  'taco': ['tacos'],
  'quesadilla': ['queso', 'quesadillas'],
  'chorreada': ['chorreadas'],
  'vampiro': ['vampiros'],
  'taco de harina': ['tacos de harina'],
  'orden de carne': ['orden de carne asada'],
  'media orden': ['media orden de carne asada'],
  'agua chica': ['agua'],
  'litro de agua': ['litro de agua'],
  'refresco vidrio': ['refresco en vidrio'],
  'refresco': ['refrescos','cocacola','coca'],
  'cebolla asada': ['cebolla asada'],
  'chiles': ['chiles'],
  'cebollita': ['cebollita']
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
  const articulos = pedido.match(/(\d+|\b(?:uno|un|una|dos|tres|cuatro|cinco)\b)\s*([a-záéíóúüñ]+)\s*(de asada|de tripa)?/ig);

  if (!articulos) {
    throw new Error('Pedido no válido');
  }

  let correccion = [];
  let total = 0;

  articulos.forEach(articulo => {
    const [, cantidad, nombre, tipo] = articulo.match(/(\d+|\b(?:uno|un|una|dos|tres|cuatro|cinco)\b)\s*([a-záéíóúüñ]+)\s*(de asada|de tripa)?/i);
    const reconocido = reconocerSinonimo(nombre);
    const cantidadNumerica = palabraANumero(cantidad);
    const costo = calcularCosto(reconocido, cantidadNumerica);
    total += costo;
    correccion.push(`${cantidadNumerica} ${reconocido}${tipo ? ` ${tipo}` : ''} $${costo}`);
  });

  return {
    correccion: correccion.join(', '),
    total: total
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



module.exports = { generarCorreccion }


