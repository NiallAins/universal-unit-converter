import UNITS_CSV from './units.csv.js';
import { tUnit, eDomain, tSiUnits, eCategory, tSiUnitKeys } from './types.js';


//
// Private readonly variables
//

const
    _STRINGS_SINGLE: { [key: string]: string } = {
        'Kelvin':        'Degree Kelvin',
        'Rankine':       'Degree Rankine',
        'Fahrenheit':    'Degree Fahrenheit',
        'Delisle':       'Degree Delisle',
        'Celsius':       'Degree Celsius',
        'Leiden':        'Degree Leiden',
        'Réaumur':       'Degree Réaumur',
        'Rømer':         'Degree Rømer',
        'Newton degree': 'Degree Newton',
        'Wedgwood':      'Degree Wedgwood',
        'A Series 0':    'A0',
        'A Series 1':    'A1',
        'A Series 2':    'A2',
        'A Series 3':    'A3',
        'A Series 4':    'A4',
        'A Series 5':    'A5',
        'A Series 6':    'A6',
        'A Series 7':    'A7',
        'A Series 8':    'A8',
        'A Series 9':    'A9',
        'A Series 10':   'A10',
        'B Series 0':    'B0',
        'B Series 1':    'B1',
        'B Series 2':    'B2',
        'B Series 3':    'B3',
        'B Series 4':    'B4',
        'B Series 5':    'B5',
        'B Series 6':    'B6',
        'B Series 7':    'B7',
        'B Series 8':    'B8',
        'B Series 9':    'B9',
        'B Series 10':   'B10',
        'C Series 0':    'C0',
        'C Series 1':    'C1',
        'C Series 2':    'C2',
        'C Series 3':    'C3',
        'C Series 4':    'C4',
        'C Series 5':    'C5',
        'C Series 6':    'C6',
        'C Series 7':    'C7',
        'C Series 8':    'C8',
        'C Series 9':    'C9',
        'C Series 10':   'C10'
    },

    _STRINGS_PLURAL: { [key: string]: string } = {
        'Day':                      'Days',
        'Foot':                     'Feet',
        'Kelvin':                   'Degrees Kelvin',
        'Rankine':                  'Degrees Rankine',
        'Fahrenheit':               'Degrees Fahrenheit',
        'Delisle':                  'Degrees Delisle',
        'Celsius':                  'Degrees Celsius',
        'Leiden':                   'Degrees Leiden',
        'Réaumur':                  'Degrees Réaumur',
        'Rømer':                    'Degrees Rømer',
        'Newton degree':            'Degrees Newton',
        'Wedgwood':                 'Degrees Wedgwood',
        'Acre-Foot':                'Acre-Feet',
        'Electron Radius':          'Electron Radii',
        'Earth Radius':             'Earth Radii',
        'Euro Keg':                 'Euro Kegs',
        'Shot (Euro)':              'Shots (Euro)',
        'Small Shot (Euro)':        'Small Shots (Euro)',
        'Double Shot (Euro)':       'Double Shots (Euro)',
        'Shot (BG)':                'Shots (BG)',
        'Small Shot (BG)':          'Small Shots (BG)',
        'Double Shot (BG)':         'Double Shots (BG)',
        'Shot (East Euro)':         'Shots (East Euro)',
        'Double Shot (East Euro)':  'Double Shots (East Euro)',
        'Foot per Second Squared':  'Feet per Second Squared',
        'Metre per Second Squared': 'Metres per Second Squared',
        'Foot per Second':          'Feet per Second',
        'Metre per Second':         'Metres per Second',
        'Mile per Hour':            'Miles per Hour',
        'Metre per Hour':           'Metres per Hour',
        'Cubic Foot':               'Cubic Feet',
        'Square Foot':              'Square Feet',
        'Metric Foot':              'Metric Feet',
        'Speed of Light':           '&times; Speed of Light',
        'Minute per Kilometer':     'Minutes per Kilometer',
        'Minute per Mile':          'Minutes per Mile',
        'A Series 0':    'A0s',
        'A Series 1':    'A1s',
        'A Series 2':    'A2s',
        'A Series 3':    'A3s',
        'A Series 4':    'A4s',
        'A Series 5':    'A5s',
        'A Series 6':    'A6s',
        'A Series 7':    'A7s',
        'A Series 8':    'A8s',
        'A Series 9':    'A9s',
        'A Series 10':  'A10s',
        'B Series 0':    'A0s',
        'B Series 1':    'A1s',
        'B Series 2':    'A2s',
        'B Series 3':    'A3s',
        'B Series 4':    'A4s',
        'B Series 5':    'A5s',
        'B Series 6':    'A6s',
        'B Series 7':    'A7s',
        'B Series 8':    'A8s',
        'B Series 9':    'A9s',
        'B Series 10':  'A10s',
        'C Series 0':    'A0s',
        'C Series 1':    'A1s',
        'C Series 2':    'A2s',
        'C Series 3':    'A3s',
        'C Series 4':    'A4s',
        'C Series 5':    'A5s',
        'C Series 6':    'A6s',
        'C Series 7':    'A7s',
        'C Series 8':    'A8s',
        'C Series 9':    'A9s',
        'C Series 10':  'A10s',
        'Kilogram-Force':   '',
        'Pound-Force':      '',
        'Ton-Force':        '',
        'Ton-Force (US)':   '',
        'Tonne-Force':      ''
    },

    _STRINGS_ALLOW_SI: string[] = [
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

export const
    SI_PREFIX: string[] = [
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
    ],

    CATEGORY_LABELS: { [key in eCategory]: string } = {
        [eCategory.Metric]:       'Metric',
        [eCategory.Imperial]:     'Imperial',
        [eCategory.Us]:           'American',
        [eCategory.Troy]:         'Troy',
        [eCategory.Scientific]:   'Scientific',
        [eCategory.Navigational]: 'Navigational',
        [eCategory.NonAnglo]:     'Non-Anglophone',
        [eCategory.Paper]:        'Paper',
        [eCategory.PaperUs]:      'American Paper',
        [eCategory.Typo]:         'Typographic',
        [eCategory.ArchaicTypo]:  'Archaic Typographic',
        [eCategory.Informal]:     'Informal',
        [eCategory.Archaic]:      'Archaic'
    },

    UNITS: tUnit[] = _unitsCsvToJson(UNITS_CSV),
    
    DOMAINS: { [key in eDomain]: {
        scale: number,
        siUnits: tSiUnits
    } } = {
        [eDomain.Time]:         { scale: 1,               siUnits: { s: 1                       } },
        [eDomain.Length]:       { scale: 1,               siUnits: { m: 1                       } },
        [eDomain.Area]:         { scale: 1,               siUnits: { m: 2                       } },
        [eDomain.Volume]:       { scale: 1,               siUnits: { m: 3                       } },
        [eDomain.Mass]:         { scale: 0.001,           siUnits: { kg: 1                      } },
        [eDomain.Speed]:        { scale: 1,               siUnits: { m: 1, s: -1                } },
        [eDomain.Acceleration]: { scale: 1,               siUnits: { m: 1, s: -2                } },
        [eDomain.Force]:        { scale: 1,               siUnits: { m: 1, s: -2, kg: 1         } },
        [eDomain.Temperature]:  { scale: 4184,            siUnits: { m: 2, s: -2, kg: 1, kw: -1 } },
        [eDomain.Angle]:        { scale: 1,               siUnits: {                            } },
        [eDomain.Current]:      { scale: 1.602176634e-19, siUnits: { s: -1, e: 1                } },
        [eDomain.Amount]:       { scale: 1,               siUnits: {                            } },
        [eDomain.Luminosity]:   { scale: 0.00146412884,   siUnits: { m: 2, s: 1, kg: 1, r: -2   } }
    },

    SI_UNIT_LABELS: { [key in keyof Required<tSiUnits>]: string } = {
        s:  's',
        m:  'm',
        kg: 'kg',
        e:  '<i>e</i>',
        kw:  'kg of water',
        mw:  'm<sup>3</sup> of water',
        c:  '<i>c</i>',
        r:  'rad'
    };



//
// Private functions
//

function _unitsCsvToJson(csv: string): tUnit[] {
    const
        DOMAIN_HEADER_ROW = 0,
        COLS_PER_DOMAIN = 6,
        UNITS_ROW_START = 2;

    // Get rows and cols (exclude empty rows)
    const
        ROWS: string[][] = csv
            .split('\n')
            .filter(row => !row.match(/^,*$/))
            .map(row => row.split(',')),
        ROW_COUNT = ROWS.length,
        COL_COUNT = ROWS[0].length;

    // Get domain headers
    const DOMAINS = ROWS[DOMAIN_HEADER_ROW]
        .filter(col => col !== '')
        .map(row => eDomain[row as keyof typeof eDomain])

    // Get units
    const UNIT_ARR: [eDomain, string[]][] = [];
    for (let c = 0, d = 0; c < COL_COUNT; c += COLS_PER_DOMAIN, d += 1) {
        for (let r = UNITS_ROW_START; r < ROW_COUNT; r++) {
            const UNIT_CELLS = ROWS[r].slice(c, c + COLS_PER_DOMAIN);
            if (UNIT_CELLS.some(cell => cell)) {
                UNIT_ARR.push([ DOMAINS[d], UNIT_CELLS ]);
            }
        }
    }

    // Unit data to Json
    return UNIT_ARR
        .map(u => {
            const
                domain = u[0],
                [name, categoryLabel, symbol, description, scale, offset] = u[1],
                category = eCategory[categoryLabel as keyof typeof eCategory];
            return {
                name,
                domain,
                symbol,
                description,
                category,
                scale:  parseFloat(scale),
                offset: parseFloat(offset) || 0,
                invert: offset === 'invert',
                searchString:
                    (
                        name +
                        symbol +
                        (name.match(/re$/) ? name.replace(/re$/, 'er') : '')
                    ).toLowerCase().replace(/[^a-z0-9]/g, ''),
                string: [
                    _STRINGS_SINGLE[name] || name,
                    _STRINGS_PLURAL[name] === ''
                        ? (_STRINGS_SINGLE[name] || name)
                        : _STRINGS_PLURAL[name] || (
                            category === eCategory.NonAnglo
                                ? name
                                : name.match(/e?y($| \()/)
                                ? name.replace(/e?y($| \()/, 'ies$1')
                                : name.match(/[xs]($| \()/)
                                ? name.replace(/([xs])($| \()/, '$1es$2')
                                : (name + 's').replace(/ \((.*)s/, 's ($1')
                        )
                ],
                siPrepend:
                    domain === eDomain.Temperature ||
                    (domain === eDomain.Area && !name.match(/^[a-z]{2}[^ ]*$/i)) ||
                    _STRINGS_ALLOW_SI.indexOf(name) > -1
            };
        })
        .sort((a, b) => a.name < b.name ? -1 : 1) as tUnit[];
}