const convertTime = (time) => {
    var hours = Math.floor(time / 60);
    var minutes = time % 60;
    var mm = minutes.toString();
    if (minutes < 10){mm = minutes+"0"}

    return hours + ":" + mm;
};

const convertDate = (date) => {
    var d = date.split('T');
    return d[0];
};

export{convertTime, convertDate};