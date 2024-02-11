import { supabase } from '@/plugins/supabase';
import { getDateTimeStamp } from '@/util/dates.js'

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

export {
    searchFlies,
    getFly
}