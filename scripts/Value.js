import { eDomain } from './types.js';
import { CATEGORY_LABELS, DOMAINS, SI_PREFIX } from './data.js';
//
// Private readonly variables
//
const SI_PREFIX_ZERO = (SI_PREFIX.length - 1) * 0.5, SI_PREFIX_MAX = 3 * (SI_PREFIX_ZERO + 1), SI_PREFIX_MIN = -3 * SI_PREFIX_ZERO, NUM_MAX_DIGITS = 4;
//
// Public classes
//
export class Value {
    constructor(scale = 1, unit, noOffset = false) {
        this.inputScale = scale;
        this.inputUnit = unit;
        this.baseScale = (scale * unit.scale) + (noOffset ? 0 : unit.offset);
        this.baseSiUnits = {};
        const DOMAIN = DOMAINS[this.inputUnit.domain];
        this.multiply({
            baseSiUnits: DOMAIN.siUnits,
            baseScale: DOMAIN.scale
        });
    }
    multiply(value) {
        this.baseScale *= value.baseScale;
        Object.keys(Object.assign(Object.assign({}, value.baseSiUnits), this.baseSiUnits))
            .forEach(v => this.baseSiUnits[v] = (this.baseSiUnits[v] || 0) + (value.baseSiUnits[v] || 0));
    }
    divideInto(value) {
        this.baseScale = this.baseScale ? (value.baseScale / this.baseScale) : 0;
        Object.keys(Object.assign(Object.assign({}, value.baseSiUnits), this.baseSiUnits))
            .forEach(v => this.baseSiUnits[v] = (value.baseSiUnits[v] || 0) - (this.baseSiUnits[v] || 0));
    }
    toStringDescription(convertKg = false) {
        let [prefix, e] = this._getStringParams(convertKg);
        return _createDescription(this.inputUnit, this.inputUnit.siPrepend, prefix ? e : 0);
    }
    toString(convertKg = false) {
        if (!this.baseScale) {
            return [
                '0',
                this.inputUnit.string[1],
                '',
                _createDescription(this.inputUnit, this.inputUnit.siPrepend),
                false
            ];
        }
        let [prefix, e, scale, units, neg, log] = this._getStringParams(convertKg);
        scale =
            scale.indexOf('.') > -1 && scale.indexOf('.') <= NUM_MAX_DIGITS
                ? scale.substring(0, 6).replace(/\.?0+$/, '')
                : scale.substring(0, 5).replace(/^(\d+)(\d{3})/, '$1,$2');
        scale = `<span class="inputs__output-number">${scale}</span>`;
        let toProxy = this.inputUnit.string[scale === '1' ? 0 : 1], unitPre = Object
            .entries(units)
            .filter(u => u[1] > 0 && u[0] !== 'w')
            .map(u => u[1] === 1 ? u[0] : u[0] + `<sup>${u[1]}</sup>`)
            .join('⋅')
            .replace(/⋅?c/, ' light –'), unitPost = Object
            .entries(units)
            .filter(u => u[1] < 0)
            .map(u => [u[0], u[1] * -1])
            .map(u => u[1] === 1 ? u[0] : u[0] + `<sup>${u[1]}</sup>`)
            .join('⋅');
        if (unitPost) {
            unitPost = 'per ' + unitPost;
        }
        if (units.w) {
            unitPost =
                (units.w > 0 ? 'of' : 'per') +
                    ' water' +
                    (units.w !== 1 ? `<sup>${Math.abs(units.w)}</sup> ` : ' ');
            unitPost;
        }
        if (prefix) {
            // Alter for prefix + kilogram case
            if (toProxy.indexOf('Kilo') === 0 && e !== 0) {
                toProxy = toProxy.slice(4);
                e += 3;
            }
            if (e !== 0) {
                const PREFIX = SI_PREFIX[SI_PREFIX_ZERO + (e / 3)];
                toProxy = this.inputUnit.siPrepend
                    ? (this.inputUnit.domain === eDomain.Temperature
                        ? (PREFIX + toProxy[0].toLowerCase() + toProxy.slice(1))
                        : PREFIX + ' ' + toProxy)
                    : toProxy.replace(/( ?)([^ ])([^ ]*)($| \()/, (_, $1, $2, $3, $4) => $1 + PREFIX +
                        ($2.toLowerCase() === PREFIX[PREFIX.length - 1]
                            ? '-' + $2
                            : $2.toLowerCase()) + $3 + $4);
            }
        }
        else if (e > NUM_MAX_DIGITS || e < -NUM_MAX_DIGITS) {
            unitPre = '&times;10<sup>' + e + '</sup> ' + unitPre;
        }
        return [
            (neg ? '&minus;' : '') + scale + ' ' + unitPre,
            toProxy,
            unitPost,
            _createDescription(this.inputUnit, this.inputUnit.siPrepend, prefix ? e : 0),
            log >= SI_PREFIX_MIN && log < SI_PREFIX_MAX && !(log >= 0 && log < 3)
        ];
    }
    _getStringParams(convertKg) {
        let [scale, units] = insertProxyUnits(Math.abs(this.baseScale), this.baseSiUnits, convertKg), neg = this.baseScale < 0, log = Math.log10(scale), prefix = log >= SI_PREFIX_MIN && log < SI_PREFIX_MAX, e = 0;
        if (prefix) {
            while (scale >= 1000) {
                scale /= 1000;
                e += 3;
            }
            while (scale < 1) {
                scale *= 1000;
                e -= 3;
            }
        }
        else if (scale < 0.0001 || scale >= 100000) {
            while (scale >= 10) {
                scale /= 10;
                e += 1;
            }
            while (scale < 1) {
                scale *= 10;
                e -= 1;
            }
        }
        return [
            prefix,
            e,
            String(scale),
            units,
            neg,
            log
        ];
    }
}
;
//
// Private functions
//
function insertProxyUnits(scale, units, convertKg) {
    // Light-...
    while (scale && units.m && units.s && units.s * units.m < 0) {
        if (units.s > 0) {
            units.s -= 1;
            units.m += 1;
            units.c = (units.c || 0) - 1;
            scale /= 299972458;
        }
        else {
            units.s += 1;
            units.m -= 1;
            units.c = (units.c || 0) + 1;
            scale *= 299972458;
        }
    }
    // Water-...
    if (convertKg && units.kg &&
        (units.m || units.s)) {
        for (let i = 0; i < units.kg; i++) {
            scale *= units.kg > 0 ? 0.001 : 1000;
            units.w = (units.w || 0) + (units.kg > 0 ? 1 : -1);
            units.m = (units.m || 0) + (units.kg > 0 ? 3 : -3);
        }
        units.kg = 0;
    }
    return [scale, units];
}
function _createDescription(unit, siPrepend, exp = 0) {
    let nameSingle = unit.string[0], nameDouble = unit.string[1], namePrefix = '';
    if (exp !== 0) {
        namePrefix = nameSingle;
        let strExp = exp;
        if (namePrefix.indexOf('Kilo') === 0) {
            namePrefix = namePrefix.slice(4);
            exp -= 3;
        }
        const PREFIX = SI_PREFIX[SI_PREFIX_ZERO + (strExp / 3)];
        namePrefix = siPrepend
            ? PREFIX + ' ' + namePrefix
            : namePrefix.replace(/( ?)([^ ])([^ ]*)($| \()/, (_, $1, $2, $3, $4) => $1 + PREFIX + $2.toLowerCase() + $3 + $4);
    }
    nameSingle = nameSingle.replace(/^([^(]*) \(([^)]*)\)/, '$2 $1');
    nameDouble = nameDouble.replace(/^([^(]*) \(([^)]*)\)/, '$2 $1');
    namePrefix = namePrefix.replace(/^([^(]*) \(([^)]*)\)/, '$2 $1');
    return `
        ${namePrefix ?
        `One ${namePrefix} is equal to 10<sup>${exp}</sup> ${nameDouble}<br/>`
        : ''}
        ${_addArticle(nameSingle, true)} is
        ${_addArticle(CATEGORY_LABELS[unit.category])}
        unit of ${eDomain[unit.domain]}</br>
        It is equivilent to
        ${unit.description.match(/^\d/)
        ? ''
        : _addArticle(unit.description, false, true)}
        <span class="inputs__description--code">
            ${unit.description}
        </span>
        ${unit.symbol ?
        ` and has the symbol
            <span class="inputs__description--code">
                ${unit.symbol}
            </span>`
        : ''}
    `;
}
function _addArticle(str, capital = false, excludeStr = false) {
    return (capital ? 'A' : 'a') +
        (str[0].match(/^[aeiou]/i) && !str.match(/^eur/i) && !str.match(/^us/i) ? 'n ' : ' ') +
        (excludeStr ? '' : str);
}
