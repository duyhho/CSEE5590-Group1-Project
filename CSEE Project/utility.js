export function clamp(input, min, max) {
    return Math.max(min, Math.min(max, input));
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    console.log("Min: " + min);
    console.log("Max: " + max);

    let randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    while (randNum % 2 === 0) {
        randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return randNum;
}
