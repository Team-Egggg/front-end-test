const parseTime = require('./parseTime');

console.log(parseTime);
test('0이 들어오면 "0분 00초"를 반환한다.', () => {
    expect(parseTime(0)).toBe('0분 00초');
});
test('59가 들어오면 "0분 59초"를 반환한다.', () => {
    expect(parseTime(59)).toBe('0분 59초');
});
test('360이 들어오면 "6분 00초"를 반환한다.', () => {
    expect(parseTime(360)).toBe('6분 00초');
});
test('79가 들어오면 "1분 19초"를 반환한다.', () => {
    expect(parseTime(79)).toBe('1분 19초');
});
