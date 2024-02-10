import { supabase } from '@/plugins/supabase';

const getAirports = async () => {
    const { data, error } = await supabase
        .from('aeropuertos')
        .select('')
    if (!error) {
        return data
    }
    return []
}

const getAirlines = async () => {
    const { data, error } = await supabase
        .from('aerolineas')
        .select('')
    if (!error) {
        return data
    }
    return []
}


export {
    getAirports,
    getAirlines
}