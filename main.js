import renderFilters from './filters.js';
import CUSTOM_STRINGS from './custom-strings.js'; 
import UNITS_CSV from './units-csv.js';


//
// Convert units CSV
//

const UNITS = csvToUnits(UNITS_CSV);

function csvToUnits(csv) {
    let arr = csv
        .split('\n')
        .filter(row => !row.match(/^,*$/))
        .map(row => row
            .split(',')
            .filter((_, col) => col > 3)
        );
    let cols = arr[0]
        .map((cell, col) => cell !== '' ? [cell.toLowerCase(), col] : '')
        .filter(cell => cell !== '');
    arr = arr.slice(2);
    let units = [];
    cols.forEach((c, ci, cArr) => {
        arr.forEach(row => {
            let NEW_ROW = cArr[ci + 1]
                ? row.slice(c[1], cArr[ci + 1][1] - 1)
                : row.slice(c[1]);
            if (NEW_ROW.some(cell => cell !== '')) {
                units.push([ c[0], ...NEW_ROW ]);
            }
        });
    });
    units = units
        .map(u => ({
            name:     u[1],
            symbol: u[3] && u[3] !== '-' ? u[3] : '',
            domain: u[0],
            description: u[4],
            scale:    parseFloat(u[5]),
            offset: parseFloat(u[6]) || 0,
            category: u[2],
            searchString: (u[1] + u[3]).toLowerCase().replace(/[^a-z0-9]/g, ''),
            string: [
                CUSTOM_STRINGS.single[u[1]] || u[1],
                CUSTOM_STRINGS.plural[u[1]] === ''
                    ? (CUSTOM_STRINGS.single[u[1]] || u[1])
                    : CUSTOM_STRINGS.plural[u[1]] || (
                        u[2] === 'non-anglophone'
                            ? u[1]
                            : u[1].match(/e?y($| \()/)
                            ? u[1].replace(/e?y($| \()/, 'ies$1')
                            : u[1].match(/[xs]($| \()/)
                            ? u[1].replace(/([xs])($| \()/, '$1es$2')
                            : (u[1] + 's').replace(/ \((.*)s/, 's ($1')
                    )
            ]
        }))
        .sort((a, b) => a.name < b.name ? -1 : 1);
    units.forEach(u => u.siPrepend =
        u.domain === 'temperature' ||
        (u.domain === 'area' && !u.string[0].match(/^[a-z]{2}[^ ]*$/i)) ||
        CUSTOM_STRINGS.si.indexOf(u.name) > -1,
    );

    return units;
}


//
// Constants
//

const
    SI_PREFIX = [
        'Quecto', 'Ronto', 'Yocto', 'Zepto', 'Atto', 'Femto', 'Pico', 'Nano', 'Micro', 'Milli',
        '', 'Kilo', 'Mega', 'Giga', 'Tera', 'Peta', 'Exa', 'Zetta', 'Yotta', 'Ronna', 'Quetta'
    ],
    SI_PREFIX_ZERO = (SI_PREFIX.length - 1) * 0.5,
    SI_PREFIX_MAX = 3 * (SI_PREFIX_ZERO + 1),
    SI_PREFIX_MIN = -3 * SI_PREFIX_ZERO,
    NUM_MAX_DIGITS = 4,
    DOMAINS = {
        time:                 { name: 'Second',     symbol: 's',     scale: 1,                            units: { s: 1    } },
        length:             { name: 'Metre',        symbol: 'm',     scale: 1,                            units: { m: 1    } },
        area:                 { scale: 1, units: { m: 2 } },
        volume:             { scale: 1, units: { m: 3 } },
        mass:                 { name: 'Kilogram', symbol: 'kg',    scale: 0.001,                    units: { kg: 1 } },
        acceleration: { scale: 1, units: { m: 1, s: -2 }},
        force:                { scale: 1, units: { m: 1, s: -2, kg: 1 }},
        temperature:    { name: 'Kelvin',     symbol: 'K',     scale: 1.380649e-23,     units: { kg: 1, m: 2, s: -2 } },
        angle:                { scale: 1, units: {            } },
    },
    CATEGORIES_ORDER = [
        'metric',
        'imperial',
        'us',
        'troy',
        'scientific',
        'navigational',
        'non-anglophone',
        'paper',
        'paper us',
        'typographic',
        'archaic typographic ',
        'informal',
        'archaic'
    ],
    CATEGORIES = Array
        .from(new Set(UNITS.map(u => u.category)))
        .sort((a, b) => CATEGORIES_ORDER.indexOf(a) - CATEGORIES_ORDER.indexOf(b)),
    SUB_DIVISIONS = [
        [ 'Foot',        '′ 12′′',       '12' ],
        [ 'Stone',       ' 14lb 16oz',   '14' ],
        [ 'Pound',       ' 16oz',        '16' ],
        [ 'Degree',      '° 00′ 00′′',   ],
        [ 'Arcminute ',  '′ 00′′',       ],
        [ 'Minute',      ':60'           ],
        [ 'Hour',        ':60:60'        ],
        [ 'Day',         ' 24:60:60'     ],
        [ 'Week',        '7d 24:60:60'   ],
        [ 'Fortnight',   '14d 24:60:60'  ],
        [ 'Quarantine',  '40d 24:60:60'  ],
        [ 'Trimester',   '91d 24:60:60'  ],
        [ 'Semester',    '126d 24:60:60' ],
        [ 'Common year', '365d 24:60:60' ],
        [ 'Leap Year',   '366d 24:60:60' ]
    ];

document.body.innerHTML += renderFilters(DOMAINS, CATEGORIES, UNITS);

const
    EL_APP =                 document.getElementById('EL_APP'),
    EL_INPUT_AMOUNT =        document.getElementById('EL_INPUT_AMOUNT'),
    EL_INPUT_FROM =          document.getElementById('EL_INPUT_FROM'),
    EL_INPUT_FROM_DESC =     document.getElementById('EL_INPUT_FROM_DESC'),
    EL_INPUT_FROM_PROXY =    document.getElementById('EL_INPUT_FROM_PROXY'),
    EL_INPUT_TO =            document.getElementById('EL_INPUT_TO'),
    EL_INPUT_TO_DESC =       document.getElementById('EL_INPUT_TO_DESC'),
    EL_INPUT_TO_PROXY =      document.getElementById('EL_INPUT_TO_PROXY'),
    EL_OUTPUT =              document.getElementById('EL_OUTPUT'),
    EL_OUTPUT_PER =          document.getElementById('EL_OUTPUT_PER'),
    EL_OUTPUT_PER_CONTAIN =  document.getElementById('EL_OUTPUT_PER_CONTAIN'),
    EL_FILTERS =             document.getElementById('EL_FILTERS'),
    EL_FILTERS_SEARCH =      document.getElementById('EL_FILTERS_SEARCH'),
    EL_BUTTON_FORMAT =       document.getElementById('EL_BUTTON_FORMAT');


//
// Classes
//

class Value {
    base = {
        scale: 1,
        units: []
    };
    origin = {
        scale: 1,
        unit: []
    };

    constructor(s = 1, u, noOffset = false) {
        this.origin.scale = s;
        this.origin.unit = u;

        this.base.scale = (s * this.origin.unit.scale) + (noOffset ? 0 : this.origin.unit.offset);
        this.multiply({ base: DOMAINS[this.origin.unit.domain] });
    }
    
    multiply(value) {
        this.base.scale *= value.base.scale;
        Object
            .keys({...value.base.units, ...this.base.units })
            .forEach(v => this.base.units[v] = (this.base.units[v] || 0) + value.base.units[v]);
    }

    divideInto(value) {
        this.base.scale = this.base.scale ? (value.base.scale / this.base.scale) : 0;

        Object
            .keys({ ...value.base.units, ...this.base.units })
            .forEach(v => this.base.units[v] = (value.base.units[v] || 0) - (this.base.units[v] || 0));
    }

    toString(descriptionOnly = false, convertKg = false) {
        if (!this.base.scale) {
            return [
                '0',
                this.origin.unit.string[1],
                '',
                createDescription(this.origin.unit, this.origin.unit.siPrepend)
            ];
        }

        let
            [ scale, units ] = insertProxyUnits(
                Math.abs(descriptionOnly ? this.origin.scale : this.base.scale),
                this.base.units,
                convertKg
            ),
            neg = this.base.scale < 0,
            log = Math.log10(scale),
            prefix = addPrefix && log >= SI_PREFIX_MIN && log < SI_PREFIX_MAX,
            e = 0;

        if (prefix) {
            while (scale >= 1000) {
                scale /= 1000;
                e += 3;
            }
            while (scale < 1) {
                scale *= 1000;
                e -= 3;
            }
        } else if (scale < 0.0001 || scale >= 100000) {
            while (scale >= 10) {
                scale /= 10;
                e += 1;
            }
            while (scale < 1) {
                scale *= 10;
                e -= 1;
            }
        }

        if (descriptionOnly) {
            return createDescription(this.origin.unit, this.origin.unit.siPrepend, prefix ? e : 0);
        }

        if (log >= SI_PREFIX_MIN && log < SI_PREFIX_MAX && !(log >= 0 && log < 3)) {
            EL_BUTTON_FORMAT.classList.remove('inputs__button--hide');
        } else {
            EL_BUTTON_FORMAT.classList.add('inputs__button--hide');
        }

        scale = scale.toString();
        scale =
            scale.indexOf('.') > -1 && scale.indexOf('.') <= NUM_MAX_DIGITS 
                ? scale.substring(0, 6).replace(/\.?0+$/, '')
                : scale.substring(0, 5).replace(/^(\d+)(\d{3})/, '$1,$2');
        scale = `<span class="inputs__output-number">${ scale }</span>`

        let
            toProxy = this.origin.unit.string[ scale === 1 ? 0 : 1 ],
            unitPre = Object
                .entries(units)
                .filter(u => u[1] > 0 && u[0] !== 'w')
                .map(u => u[1] === 1 ? u[0] : u[0] + `<sup>${ u[1] }</sup>`)
                .join('⋅')
                .replace(/⋅?c/, ' light –'),
            unitPost = Object
                .entries(units)
                .filter(u => u[1] < 0)
                .map(u => [ u[0], u[1] * -1 ])
                .map(u => u[1] === 1 ? u[0] : u[0] + `<sup>${ u[1] }</sup>`)
                .join('⋅');

        if (unitPost) {
            unitPost = 'per ' + unitPost;
            EL_OUTPUT_PER_CONTAIN.classList.remove('inputs__output--hide');
        } else {
            EL_OUTPUT_PER_CONTAIN.classList.add('inputs__output--hide');
        }

        if (units.w) {
            unitPost =
                (units.w > 0 ? 'of' : 'per') +
                ' water' +
                (units.w !== 1 ? `<sup>${ Math.abs(units.w) }</sup> ` : ' ')
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
                    toProxy = this.origin.unit.siPrepend
                        ? (
                            this.origin.unit.domain === 'temperature'
                                ? (PREFIX + toProxy[0].toLowerCase() + toProxy.slice(1))
                                : PREFIX + ' ' + toProxy
                        )
                        : toProxy.replace(
                                /( ?)([^ ])([^ ]*)($| \()/, 
                                (_, $1, $2, $3, $4) =>
                                    $1 + PREFIX +
                                    ($2.toLowerCase() === PREFIX[PREFIX.length - 1]
                                        ? '-' + $2
                                        : $2.toLowerCase()
                                    ) + $3 +$4
                            );
            }
        } else if (e > NUM_MAX_DIGITS || e < -NUM_MAX_DIGITS ) {
            unitPre = '&times;10<sup>' + e + '</sup> ' + unitPre;
        }
        
        return [
            (neg ? '&minus;' : '') + scale + ' ' + unitPre,
            toProxy,
            unitPost,
            createDescription(this.origin.unit, this.origin.unit.siPrepend, prefix ? e : 0)
        ];
    }
};


//
// Conversions
//

let
    fromUnit = null,
    toUnit = null;

function convert() {
    const
        AMOUNT = parseFloat(EL_INPUT_AMOUNT.value),
        FROM = fromUnit,
        TO = toUnit,
        FROM_VALUE = new Value(AMOUNT, FROM),
        TO_VALUE = new Value(1, TO, true),
        CONVERT_KG = FROM.domain === 'mass' || TO.domain === 'mass';

    if (
         (FROM.domain === 'angle' || TO.domain === 'angle') &&
        !(FROM.domain === 'angle' && TO.domain === 'angle')
    ) {
        TO_VALUE.base.scale =
            FROM.domain === 'angle'
                ? Math.tan(FROM_VALUE.base.scale)
                : Math.atan2(FROM_VALUE.base.scale);
        Object
            .keys(TO_VALUE.base.units)
            .forEach(v => TO_VALUE.base.units[v] *= -1);
        TO_VALUE.base.scale /= TO_VALUE.origin.unit.scale;
    } else {
        TO_VALUE.divideInto(FROM_VALUE);
        TO_VALUE.base.scale -= TO_VALUE.origin.unit.offset;
    }

    // Background gradient
    EL_APP.dataset.from = FROM_VALUE.origin.unit.domain;
    EL_APP.dataset.to = TO_VALUE.origin.unit.domain;

    EL_INPUT_FROM_PROXY.innerHTML = FROM.string[AMOUNT === 1 ? 0 : 1];
    EL_INPUT_FROM_DESC.innerHTML = FROM_VALUE.toString(true, CONVERT_KG);
    [
        EL_OUTPUT.innerHTML,
        EL_INPUT_TO_PROXY.innerHTML,
        EL_OUTPUT_PER.innerHTML,
        EL_INPUT_TO_DESC.innerHTML
    ] = TO_VALUE.toString(false, CONVERT_KG);
}

function insertProxyUnits(scale, units, convertKg) {
    // Light-...
    while (units.s && units.m && units.s * units.m < 0) {
        if (units.s > 0) {
            units.s -= 1;
            units.m += 1;
            units.c = (units.c || 0) - 1;
            scale /= 299972458;
        } else {
            units.s += 1;
            units.m -= 1;
            units.c = (units.c || 0) + 1;
            scale *= 299972458;
        }
    }

    // Water-...
    if    (
        convertKg && units.kg &&
        (units.m || units.s)
    ) {
        for (let i = 0; i < units.kg; i++) {
            scale *= units.kg > 0 ? 0.001 : 1000;
            units.w = (units.w || 0) + (units.kg > 0 ? 1 : -1);
            units.m = (units.m || 0) + (units.kg > 0 ? 3 : -3);
        }
        units.kg = 0;
    }

    return [ scale, units ];
}


//
// UI
//

let
    currentActiveFilter = null,
    searchFirstKey = true,
    searchOriginalValue = '',
    addPrefix = true;

function toggleFilters(target) {
    EL_FILTERS.classList.toggle('filters--open');
    EL_INPUT_FROM_DESC.classList.remove('inputs__from-description--show');
    EL_INPUT_TO_DESC.classList.remove('inputs__to-description--show');
    
    if (target) {
        currentActiveFilter = target;
        searchOriginalValue = target.value;
        const
            BOUND = currentActiveFilter.getBoundingClientRect(),
            MIN_WIDTH = 332;
        if (BOUND.width < MIN_WIDTH) {
            EL_FILTERS.style.width = MIN_WIDTH;
            EL_FILTERS.style.left = Math.max(
                16,
                BOUND.left +
                (BOUND.width / 2) -
                (EL_FILTERS.clientWidth / 2)
            ) + 'px';
        } else {
            EL_FILTERS.style.left = BOUND.left + 'px';
            EL_FILTERS.style.width = BOUND.width + 'px';
        }
        EL_FILTERS.style.top =
            BOUND.top +
            BOUND.height +
            'px';
    } else {
        searchFirstKey = true;
        currentActiveFilter.value = searchOriginalValue;
        EL_FILTERS.classList.remove('filters--search');
        
    }

    currentActiveFilter.classList.toggle('open');
}

function unitClick(unit, domain) {
    let u = UNITS.find(u => u.name === unit && u.domain === domain);

    if (currentActiveFilter === EL_INPUT_TO) {
        toUnit = u;
    } else {
        fromUnit = u;
    }
    currentActiveFilter.value = u.name;
    searchOriginalValue = u.name;
    convert();
    toggleFilters();
}

function filterKey(key) {
        if (searchFirstKey && key.length === 1) {
        setTimeout(() => {
            currentActiveFilter.value = key;
            filterSearch();
        });
    }
    searchFirstKey = false;
    setTimeout(() => filterSearch());
}

function filterSearch() {
    const
        VALUE = currentActiveFilter.value.toLowerCase().replace(/[^a-z0-9]/),
        RESULTS = UNITS.filter(u => u.searchString.indexOf(VALUE) > -1);

    if (VALUE === '') {
        EL_FILTERS.classList.remove('filters--search');
        return;
    }

    if (RESULTS.length === 0) {
        EL_FILTERS_SEARCH.innerHTML = `
            <div class="filters__modal-search-empty">
                No units found
            </div>
        `;
        return;
    }

    EL_FILTERS.classList.add('filters--search');
    EL_FILTERS_SEARCH.innerHTML = RESULTS
        .reduce((htm, u) => htm + `
            <button
                class="
                    filters__modal-button
                    filters__modal-button--${ u.domain }
                "
                onclick="unitClick('${ u.name }', '${ u.domain }')"
            >
                ${ u.name }
            </button>
        `, '');
}

function changeFormat() {
    addPrefix = !addPrefix;
    EL_BUTTON_FORMAT.innerHTML = addPrefix ? '10<sup>x</sup>' : 'SI';
    convert();
}

function setRandom(inital = false) {
    if (inital) {
        EL_INPUT_AMOUNT.value = (
            Math.floor(Math.random() * 100) *
            (10**(
                Math.random() < 0.4 ? Math.floor(Math.random() * 20) - 10 : 0
            ))
        ) || 1;
        fromUnit = UNITS[Math.floor(Math.random() * UNITS.length)];
        EL_INPUT_FROM.value = fromUnit.name;
    }
    toUnit = UNITS[Math.floor(Math.random() * UNITS.length)];
    EL_INPUT_TO.value = toUnit.name;
    convert();
}


function switchInputs() {
    const TO_UNIT = toUnit;
    toUnit = fromUnit;
    fromUnit = TO_UNIT;
    EL_INPUT_FROM.value = fromUnit.name;
    EL_INPUT_TO.value = toUnit.name;
    convert();
}

function createDescription(unit, siPrepend, exp = 0) {
    let
        nameSingle = unit.string[0],
        nameDouble = unit.string[1],
        namePrefix = '';
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
            : namePrefix.replace(
                    /( ?)([^ ])([^ ]*)($| \()/, 
                    (_, $1, $2, $3, $4) => $1 + PREFIX + $2.toLowerCase() + $3 +$4
                );
    }
    nameSingle = nameSingle.replace(/^([^(]*) \(([^)]*)\)/, '$2 $1');
    nameDouble = nameDouble.replace(/^([^(]*) \(([^)]*)\)/, '$2 $1');
    namePrefix = namePrefix.replace(/^([^(]*) \(([^)]*)\)/, '$2 $1');

    return `
        ${ namePrefix ?
            `One ${ namePrefix } is equal to 10<sup>${ exp }</sup> ${ nameDouble }<br/>`
        : '' }
        ${ addArticle(nameSingle, true) } is
        ${ addArticle(
            unit.category === 'us'
                ? 'American'
                : unit.category === 'paper us'
                ? 'American paper'
                : unit.category
        ) }
        unit of ${ unit.domain }</br>
        It is equivilent to
        ${ unit.description.match(/^\d/) ? ''    : addArticle(unit.description, false, true) }
        <span class="inputs__description--code">
            ${ unit.description }
        </span>
        ${ unit.symbol ?
            ` and has the symbol
            <span class="inputs__description--code">
                ${ unit.symbol }
            </span>`
        : '' }
    `;
}

function addArticle(str, capital, excludeStr) {
    return (capital ? 'A' : 'a') +
        (str[0].match(/^[aeiou]/i) && !str.match(/^eur/i) && !str.match(/^us/i) ? 'n ' : ' ') +
        (excludeStr ? '' : str);
}


//
// Expose functions to window
//

window.toggleFilters = toggleFilters;
window.convert = convert;
window.unitClick = unitClick;
window.filterKey = filterKey;
window.changeFormat = changeFormat;
window.setRandom = setRandom;
window.switchInputs = switchInputs;


//
// Init
//

setRandom(true);