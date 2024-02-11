

const getSession = () => {
    const existSesion = { ...JSON.parse(localStorage.getItem("sessionPerson")), ...JSON.parse(localStorage.getItem("sessionUser")) }
    if(Object.keys(existSesion).length === 0){
        return null
    }
    return existSesion
}


export {
    getSession
}