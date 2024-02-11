import moment from 'moment';

const getHourTimeStamp = (timestamp) => {
    const fecha = moment(timestamp);
    const formattedDate = fecha.format('HH:mm a');
    return formattedDate;
}

const addTimeToADate = (fecha, minutes) => {
    const fechaMoment = moment(fecha);

    // Sumar los minutos a la fecha
    const fechaNueva = fechaMoment.add(minutes, 'minutes');
  
    // Devolver la fecha resultante
    return fechaNueva.format('HH:mm a');
}

const getDateTimeStamp = (timestamp) => {
    const fecha = moment(timestamp);
    const formattedDate = fecha.format('YYYY-MM-DD');
    return formattedDate;
}

export {
    getHourTimeStamp,
    addTimeToADate,
    getDateTimeStamp
}