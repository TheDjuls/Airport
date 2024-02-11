import { supabase } from '@/plugins/supabase';
import { getDateTimeStamp } from '@/util/dates.js'
import { v4 as uuidv4 } from 'uuid';

const searchFlies = async (payloadBusqueda) => {
    const { data, error } = await supabase.rpc('searchflies', {
        pfecha: getDateTimeStamp(payloadBusqueda.fecha),
        pidaerolinea: payloadBusqueda.aerolinea, pidorigen: payloadBusqueda.origen, piddestino: payloadBusqueda.destino
    });
    if (!error && data.length > 0) {
        return data[0].resultado1 != null ? data[0].resultado1 : []
    }
    return []
}

const getFly = async (id) => {
    const { data, error } = await supabase.rpc('searchvuelobyid', {
        pidvuelo: id
    });
    if (!error && data.length > 0) {
        return data[0].resultado1 != null ? data[0].resultado1 : []
    }
    return []
}

const getSeats = async (idAvion, idTipoAsiento, idVuelo) => {
    const { data, error } = await supabase.rpc('searchseats', {
        pidavion: idAvion, pidtipo: idTipoAsiento, pidvuelo: idVuelo
    });
    if (!error && data.length > 0) {
        return data[0].resultado1 != null ? data[0].resultado1 : []
    }
    return []
}

const bookaFly = async (idVuelo, idUsuario) => {
    const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Crear un objeto Date con tu zona horaria local
    const fechaConZonaHoraria = new Date().toLocaleString("en-US", { timeZone: zonaHoraria });
    const { data, error } = await supabase
        .from('ordenes')
        .insert({ fechaOrden: fechaConZonaHoraria, idVuelo, idUsuario })
        .select()
    if (!error && data.length > 0) {
        return data[0].id
    }
    return null
}

const bookSeats = async (idOrden, idAsiento) => {
    const { error } = await supabase
        .from('ordenes_asientos')
        .insert({ idOrden, idAsiento })
    if (!error) {
        return true
    }
    return false
}

const confirmFly = async (idOrden) => {
    const uuid = uuidv4();
    // Tomar los primeros 10 caracteres del UUID y eliminar los guiones
    const folio = uuid.substr(0, 10).replace(/-/g, '').padEnd(10, '0');

    const { error } = await supabase
        .from('ordenes')
        .update({ fechaConfirmacion: new Date(), folioConfirmacion: folio })
        .eq('id', idOrden)
    if (!error) {
        return folio
    }
    return false
}

const getOrdersListByUser = async (idUsuario) => {
    const { data, error } = await supabase.rpc('listorders', {
        pidusuario: idUsuario
    });
    if (!error && data.length > 0) {
        return data[0].resultado1 != null ? data[0].resultado1 : []
    }
    return []
}

const cancelOrder = async (idOrden) => {
    const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fechaConZonaHoraria = new Date().toLocaleString("en-US", { timeZone: zonaHoraria });
    
    const { error } = await supabase
        .from('ordenes')
        .update({ fechaCancelacion: fechaConZonaHoraria })
        .eq('id', idOrden)
    if (!error) {
        return true
    }
    return false
}

export {
    searchFlies,
    getFly,
    getSeats,
    bookaFly,
    bookSeats,
    confirmFly,
    getOrdersListByUser,
    cancelOrder
}