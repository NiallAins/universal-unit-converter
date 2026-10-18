import UNITS_CSV from './units.csv.js';
import { eDomain } from './types.js';
//
// Private readonly variables
//
const _KEY_NON_ANGLO = 'non-anglophone', _CATEGORY_ORDER = [
    'metric',
    'imperial',
    'us',
    'troy',
    'scientific',
    'navigational',
    _KEY_NON_ANGLO,
    'paper',
    'paper us',
    'typographic',
    'archaic typographic ',
    'informal',
    'archaic'
], _STRINGS_SINGLE = {
    'Kelvin': 'Degree Kelvin',
    'Rankine': 'Degree Rankine',
    'Fahrenheit': 'Degree Fahrenheit',
    'Delisle': 'Degree Delisle',
    'Celsius': 'Degree Celsius',
    'Leiden': 'Degree Leiden',
    'Réaumur': 'Degree Réaumur',
    'Rømer': 'Degree Rømer',
    'Newton': 'Degree Newton',
    'Wedgwood': 'Degree Wedgwood',
    'A Series 0': 'A0',
    'A Series 1': 'A1',
    'A Series 2': 'A2',
    'A Series 3': 'A3',
    'A Series 4': 'A4',
    'A Series 5': 'A5',
    'A Series 6': 'A6',
    'A Series 7': 'A7',
    'A Series 8': 'A8',
    'A Series 9': 'A9',
    'A Series 10': 'A10',
    'B Series 0': 'B0',
    'B Series 1': 'B1',
    'B Series 2': 'B2',
    'B Series 3': 'B3',
    'B Series 4': 'B4',
    'B Series 5': 'B5',
    'B Series 6': 'B6',
    'B Series 7': 'B7',
    'B Series 8': 'B8',
    'B Series 9': 'B9',
    'B Series 10': 'B10',
    'C Series 0': 'C0',
    'C Series 1': 'C1',
    'C Series 2': 'C2',
    'C Series 3': 'C3',
    'C Series 4': 'C4',
    'C Series 5': 'C5',
    'C Series 6': 'C6',
    'C Series 7': 'C7',
    'C Series 8': 'C8',
    'C Series 9': 'C9',
    'C Series 10': 'C10'
}, _STRINGS_PLURAL = {
    'Day': 'Days',
    'Foot': 'Feet',
    'Kelvin': 'Degrees Kelvin',
    'Rankine': 'Degrees Rankine',
    'Fahrenheit': 'Degrees Fahrenheit',
    'Delisle': 'Degrees Delisle',
    'Celsius': 'Degrees Celsius',
    'Leiden': 'Degrees Leiden',
    'Réaumur': 'Degrees Réaumur',
    'Rømer': 'Degrees Rømer',
    'Newton': 'Degrees Newton',
    'Wedgwood': 'Degrees Wedgwood',
    'Acre-Foot': 'Acre-Feet',
    'Electron Radius': 'Electron Radii',
    'Earth Radius': 'Earth Radii',
    'Euro Keg': 'Euro Kegs',
    'Shot (Euro)': 'Shots (Euro)',
    'Small Shot (Euro)': 'Small Shots (Euro)',
    'Double Shot (Euro)': 'Double Shots (Euro)',
    'Shot (BG)': 'Shots (BG)',
    'Small Shot (BG)': 'Small Shots (BG)',
    'Double Shot (BG)': 'Double Shots (BG)',
    'Shot (East Euro)': 'Shots (East Euro)',
    'Double Shot (East Euro)': 'Double Shots (East Euro)',
    'Foot per Second Squared': 'Feet per Second Squared',
    'Metre per Second Squared': 'Metres per Second Squared',
    'Cubic Foot': 'Cubic Feet',
    'Square Foot': 'Square Feet',
    'Metric Foot': 'Metric Feet',
    'A Series 0': 'A0s',
    'A Series 1': 'A1s',
    'A Series 2': 'A2s',
    'A Series 3': 'A3s',
    'A Series 4': 'A4s',
    'A Series 5': 'A5s',
    'A Series 6': 'A6s',
    'A Series 7': 'A7s',
    'A Series 8': 'A8s',
    'A Series 9': 'A9s',
    'A Series 10': 'A10s',
    'B Series 0': 'A0s',
    'B Series 1': 'A1s',
    'B Series 2': 'A2s',
    'B Series 3': 'A3s',
    'B Series 4': 'A4s',
    'B Series 5': 'A5s',
    'B Series 6': 'A6s',
    'B Series 7': 'A7s',
    'B Series 8': 'A8s',
    'B Series 9': 'A9s',
    'B Series 10': 'A10s',
    'C Series 0': 'A0s',
    'C Series 1': 'A1s',
    'C Series 2': 'A2s',
    'C Series 3': 'A3s',
    'C Series 4': 'A4s',
    'C Series 5': 'A5s',
    'C Series 6': 'A6s',
    'C Series 7': 'A7s',
    'C Series 8': 'A8s',
    'C Series 9': 'A9s',
    'C Series 10': 'A10s',
    'Kilogram-Force': '',
    'Pound-Force': '',
    'Ton-Force': '',
    'Ton-Force (US)': '',
    'Tonne-Force': ''
}, _STRINGS_ALLOW_SI = [
    'Planck Length',
    'Planck Time',
    'Stoney Length',
    'Stoney Time',
    'Shot (Euro)',
    'Small Shot (Euro)',
    'Double Shot (Euro)',
    'Shot (BG)',
    'Small Shot (BG)',
    'Double Shot (BG)',
    'Shot (East Euro)',
    'Double Shot (East Euro)',
    'Human Hair Thickness',
    'Metre per Second Squared',
    'Foot per Second Squared',
    'Columbian Exchange',
    'Great Primer',
    'French Canon',
    'Horse Length',
    'Double-Decker Bus',
    'Boat Length',
    'Football Field (US)',
    'Football Field (CA)',
    'Football Field',
    'Lunar Distance',
    'Hubble length',
    'Square Inch',
    'Square Foot',
    'Square Yard',
    'Cubic Inch',
    'Cubic Foot',
    'Mini Keg',
    'Soda Syrup Keg',
    'Corny Keg',
    'Home Brew Keg',
    'Torpedo Keg',
    'Sixtel Keg',
    'Log Keg',
    'Small Keg',
    'Euro Keg',
    'Import Keg',
    'Standard Keg',
    'Full Keg',
    'Large Keg',
    'Diameter Part'
];
// SUB_DIVISIONS: [string, string, string?][] = [
//     [ 'Foot',        '′ 12′′',       '12' ],
//     [ 'Stone',       ' 14lb 16oz',   '14' ],
//     [ 'Pound',       ' 16oz',        '16' ],
//     [ 'Degree',      '° 00′ 00′′',   ],
//     [ 'Arcminute ',  '′ 00′′',       ],
//     [ 'Minute',      ':60'           ],
//     [ 'Hour',        ':60:60'        ],
//     [ 'Day',         ' 24:60:60'     ],
//     [ 'Week',        '7d 24:60:60'   ],
//     [ 'Fortnight',   '14d 24:60:60'  ],
//     [ 'Quarantine',  '40d 24:60:60'  ],
//     [ 'Trimester',   '91d 24:60:60'  ],
//     [ 'Semester',    '126d 24:60:60' ],
//     [ 'Common year', '365d 24:60:60' ],
//     [ 'Leap Year',   '366d 24:60:60' ]
// ];
//
// Public readonly variables
//
export const SI_PREFIX = [
    'Quecto',
    'Ronto',
    'Yocto',
    'Zepto',
    'Atto',
    'Femto',
    'Pico',
    'Nano',
    'Micro',
    'Milli',
    '',
    'Kilo',
    'Mega',
    'Giga',
    'Tera',
    'Peta',
    'Exa',
    'Zetta',
    'Yotta',
    'Ronna',
    'Quetta'
], UNITS = _unitsCsvToJson(UNITS_CSV), DOMAINS = {
    [eDomain.Time]: { name: 'Second', symbol: 's', scale: 1, siUnits: { m: 0, s: 1, kg: 0 } },
    [eDomain.Length]: { name: 'Metre', symbol: 'm', scale: 1, siUnits: { m: 1, s: 0, kg: 0 } },
    [eDomain.Area]: { scale: 1, siUnits: { m: 2, s: 0, kg: 0 } },
    [eDomain.Volume]: { scale: 1, siUnits: { m: 3, s: 0, kg: 0 } },
    [eDomain.Mass]: { name: 'Kilogram', symbol: 'kg', scale: 0.001, siUnits: { m: 0, s: 0, kg: 1 } },
    [eDomain.Acceleration]: { scale: 1, siUnits: { m: 1, s: -2, kg: 0 } },
    [eDomain.Force]: { scale: 1, siUnits: { m: 1, s: -2, kg: 1 } },
    [eDomain.Temperature]: { name: 'Kelvin', symbol: 'K', scale: 1.380649e-23, siUnits: { m: 2, s: -2, kg: 1 } },
    [eDomain.Angle]: { scale: 1, siUnits: { m: 0, s: 0, kg: 0 } },
}, CATEGORIES = Array
    .from(new Set(UNITS.map(u => u.category)))
    .sort((a, b) => _CATEGORY_ORDER.indexOf(a) - _CATEGORY_ORDER.indexOf(b));
//
// Private functions
//
function _unitsCsvToJson(csv) {
    //
    // Structure of units.csv
    //
    //   Row 0:   Domain headers
    //   Row 2+:  Unit data
    //
    //   Col 0, 1, 2:              SI Prefix name, symbol, scale
    //   Col 6n + (4, 5, 6, 7, 8): Unit name, category, symbol, derivation, scale
    //     where n = Domain index
    //
    // Get rows and cols (exclude empty rows)
    const ROWS = csv
        .split('\n')
        .filter(row => !row.match(/^,*$/))
        .map(row => row
        .split(',')
        .filter((_, col) => col >= 4));
    // Get domain headers
    const COLS = ROWS[0]
        .map((content, colIndex) => [content, colIndex])
        .filter(col => col[0] !== '');
    // Get units
    const UNIT_ARR = [];
    COLS.forEach((col, ci) => {
        ROWS
            .slice(2)
            .forEach(row => {
            const UNIT_CELLS = COLS[ci + 1]
                ? row.slice(col[1], COLS[ci + 1][1] - 1)
                : row.slice(col[1]);
            if (UNIT_CELLS.some(cell => cell !== '')) {
                UNIT_ARR.push([col[0], ...UNIT_CELLS]);
            }
        });
    });
    return UNIT_ARR
        .map(u => {
        const name = u[1], domain = eDomain[u[0]];
        return {
            name,
            domain,
            symbol: u[3] && u[3] !== '-' ? u[3] : '',
            description: u[4],
            scale: parseFloat(u[5]),
            offset: parseFloat(u[6]) || 0,
            category: u[2],
            searchString: (u[1] + u[3]).toLowerCase().replace(/[^a-z0-9]/g, ''),
            string: [
                _STRINGS_SINGLE[u[1]] || u[1],
                _STRINGS_PLURAL[u[1]] === ''
                    ? (_STRINGS_SINGLE[u[1]] || u[1])
                    : _STRINGS_PLURAL[u[1]] || (u[2] === _KEY_NON_ANGLO
                        ? u[1]
                        : u[1].match(/e?y($| \()/)
                            ? u[1].replace(/e?y($| \()/, 'ies$1')
                            : u[1].match(/[xs]($| \()/)
                                ? u[1].replace(/([xs])($| \()/, '$1es$2')
                                : (u[1] + 's').replace(/ \((.*)s/, 's ($1'))
            ],
            siPrepend: domain === eDomain.Temperature ||
                (domain === eDomain.Area && !u[0].match(/^[a-z]{2}[^ ]*$/i)) ||
                _STRINGS_ALLOW_SI.indexOf(name) > -1
        };
    })
        .sort((a, b) => a.name < b.name ? -1 : 1);
}
