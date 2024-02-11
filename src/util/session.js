

const getSession = () => {
    const existSesion = { ...JSON.parse(localStorage.getItem("sessionPerson")), ...JSON.parse(localStorage.getItem("sessionUser")) }
    if(Object.keys(existSesion).length === 0){
        return null
    }
    return existSesion
}

const getIdUserLogged = () => {
    const session = JSON.parse(localStorage.getItem("sessionUser"));
    if(session){
        return session.id;
    }
}

const getTypeUserLogged = () => {
    const session = JSON.parse(localStorage.getItem("sessionUser"));
    if(session){
        return session.idTipoUsuario;
    }
}


export {
    getSession,
    getIdUserLogged,
    getTypeUserLogged
}