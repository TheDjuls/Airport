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

const saveUser = async (usuario) => {
    const { data, error } = await supabase
        .from('usuarios')
        .insert({correo: usuario.correo, password: usuario.password, idTipoUsuario: 1})
        .select()
    if (!error) {
        return data
    }
    return error
}

const savePerson = async (persona, idUsuarios) => {
    console.log(persona, idUsuarios)
    const { data, error } = await supabase
        .from('personas')
        .insert({nombre: persona.nombre, apellidoPaterno: persona.apellidoPaterno, apellidoMaterno: persona.apellidoMaterno, idUsuarios})
        .select()
    if (!error) {
        return data
    }
    return error
}

const getUserPerson = async (correo, password) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*,personas(*)')
        .eq('correo', correo)
        .eq('password', password)
    if (!error) {
        return data
    }
    return []
}


export {
    getAirports,
    getAirlines,
    saveUser,
    savePerson,
    getUserPerson
}