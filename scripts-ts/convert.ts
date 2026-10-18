import { eDomain, tSiUnitKeys, tUnit } from './types.js';
import { Value } from './Value.js';


//
// Conversions
//

export function convert(amount: number, from: tUnit, to: tUnit): [Value, Value, boolean] {
    const
        FROM_VALUE = new Value(amount, from),
        TO_VALUE = new Value(1, to, true),
        CONVERT_KG = from.domain === eDomain.Mass || to.domain === eDomain.Mass;

    if (
         (from.domain === eDomain.Angle || to.domain === eDomain.Angle) &&
        !(from.domain === eDomain.Angle && to.domain === eDomain.Angle)
    ) {
        TO_VALUE.baseScale =
            from.domain === eDomain.Angle
                ? Math.tan(FROM_VALUE.baseScale)
                : Math.atan2(FROM_VALUE.baseScale, 1);
        (Object.keys(TO_VALUE.baseSiUnits) as tSiUnitKeys)
            .forEach(v => TO_VALUE.baseSiUnits[v]! *= -1);
        TO_VALUE.baseScale /= TO_VALUE.inputScale;
    } else {
        TO_VALUE.divideInto(FROM_VALUE);
        TO_VALUE.baseScale -= TO_VALUE.inputUnit.offset;
    }

    return [
        FROM_VALUE,
        TO_VALUE,
        CONVERT_KG
    ];
}
