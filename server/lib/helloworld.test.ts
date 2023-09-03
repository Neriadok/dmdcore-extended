import {hello} from "./helloworld";


test('its hello world', testDefaultValue);
test('it hello given name', testGivenValue);

function testDefaultValue() {
    const actual = hello()
    const expected = 'Hello World!'
    expect(actual).toBe(expected);
}
function testGivenValue() {
    const given = 'Jimmy'
    const actual = hello(given)
    const expected = 'Hello Jimmy!'
    expect(actual).toBe(expected);
}