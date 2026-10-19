import { eDomain } from './types.js';
import { Value } from './Value.js';
//
// Public functions
//
export function convert(amount, from, to) {
    const NO_OFFSET = _xor(from.domain === eDomain.Temperature, to.domain === eDomain.Temperature), FROM_VALUE = new Value(from.invert ? 1 / amount : amount, from, NO_OFFSET), TO_VALUE = new Value(1, to, true), CONVERT_KG = from.domain === eDomain.Mass || to.domain === eDomain.Mass;
    if (_xor(from.domain === eDomain.Angle, to.domain === eDomain.Angle)) {
        if (from.domain === eDomain.Angle) {
            TO_VALUE.baseScale = Math.tan(FROM_VALUE.baseScale) * TO_VALUE.baseScale;
            ;
            Object.keys(TO_VALUE.baseSiUnits)
                .forEach(v => TO_VALUE.baseSiUnits[v] *= -1);
        }
        else {
            TO_VALUE.baseScale = Math.atan2(FROM_VALUE.baseScale, 1) / TO_VALUE.baseScale;
            Object.keys(FROM_VALUE.baseSiUnits)
                .forEach(v => TO_VALUE.baseSiUnits[v] = FROM_VALUE.baseSiUnits[v]);
        }
    }
    else {
        TO_VALUE.divideInto(FROM_VALUE);
        TO_VALUE.baseScale -= NO_OFFSET ? 0 : TO_VALUE.inputUnit.offset;
    }
    if (to.invert) {
        TO_VALUE.baseScale = 1 / TO_VALUE.baseScale;
    }
    return [
        FROM_VALUE,
        TO_VALUE,
        CONVERT_KG
    ];
}
//
// Private functions
//
function _xor(a, b) {
    return (a || b) && (!a || !b);
}
function _nand(a, b) {
    return !(a && b);
}
