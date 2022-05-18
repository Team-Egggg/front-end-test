function parseTime(time){
    const minute = Math.floor(time / 60);
    const second = (time % 60) || '00';
    return `${minute}분 ${second}초`
}

module.exports = parseTime;
