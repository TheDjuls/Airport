const getidUserLoggedInfo = () => {
    let dataJson = localStorage.getItem('user_db');
    dataJson = JSON.parse(dataJson)
    return dataJson.idusuario
}

const getidUserLoggedInfoEmpresa = () => {
    let dataJson = localStorage.getItem('user_db');
    dataJson = JSON.parse(dataJson)
    return dataJson.empresas.idempresa
}

export {
    getidUserLoggedInfo,
    getidUserLoggedInfoEmpresa
}