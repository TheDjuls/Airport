const primeraLetraMayuscula = (texto) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const eliminarRepetidos = (array, propiedad) => {
    const set = new Set();
    return array.filter(objeto => {
      const valor = objeto[propiedad];
      if (!set.has(valor)) {
        set.add(valor);
        return true;
      }
      return false;
    });
  }

const convertBooleanToNumber = (value) => {
  return value ? 1 : 0
}

const convertNumberToBoolean = (value) => {
  return value  === 1 ? true : false
}

export {
    primeraLetraMayuscula,
    eliminarRepetidos,
    convertBooleanToNumber,
    convertNumberToBoolean
}