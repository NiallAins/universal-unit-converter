import { convert } from './convert.js';
import { CATEGORY_LABELS, DOMAINS, UNITS } from './data.js';
import { eCategory, eDomain, tUnit } from './types.js';


//
// Private readonly variables
//

const
    EL_APP =                document.getElementById('EL_APP')                as HTMLElement,
    EL_INPUT_AMOUNT =       document.getElementById('EL_INPUT_AMOUNT')       as HTMLInputElement,
    EL_INPUT_FROM =         document.getElementById('EL_INPUT_FROM')         as HTMLInputElement,
    EL_INPUT_FROM_DESC =    document.getElementById('EL_INPUT_FROM_DESC')    as HTMLElement,
    EL_INPUT_FROM_PROXY =   document.getElementById('EL_INPUT_FROM_PROXY')   as HTMLElement,
    EL_INPUT_TO =           document.getElementById('EL_INPUT_TO')           as HTMLInputElement,
    EL_INPUT_TO_DESC =      document.getElementById('EL_INPUT_TO_DESC')      as HTMLElement,
    EL_INPUT_TO_PROXY =     document.getElementById('EL_INPUT_TO_PROXY')     as HTMLElement,
    EL_OUTPUT =             document.getElementById('EL_OUTPUT')             as HTMLElement,
    EL_OUTPUT_PER =         document.getElementById('EL_OUTPUT_PER')         as HTMLElement,
    EL_OUTPUT_PER_CONTAIN = document.getElementById('EL_OUTPUT_PER_CONTAIN') as HTMLElement,
    EL_FILTERS =            document.getElementById('EL_FILTERS')            as HTMLElement,
    EL_FILTERS_SEARCH =     document.getElementById('EL_FILTERS_SEARCH')     as HTMLElement,
    EL_BUTTON_FORMAT =      document.getElementById('EL_BUTTON_FORMAT')      as HTMLElement,
    EL_FILTERS_BUTTONS =    document.getElementById('EL_FILTERS_BUTTONS')    as HTMLElement,
    EL_FILTERS_RESULT =     document.getElementById('EL_FILTERS_RESULT')     as HTMLElement;


//
// Private variables
//

let
    currentActiveFilter: HTMLInputElement = EL_INPUT_FROM,
    searchOriginalValue: string = '',
    addPrefix: boolean = true,
    searchFirstKey: boolean = false,
    fromUnit: tUnit = UNITS[0],
    toUnit: tUnit = UNITS[0];
 

//
// Public functions
//

export function init() {
    _renderFilters();
    _exposeToWindow();
    setRandom(true);
}


//
// Public window functions
//

declare const window: Window & {
    toggleFilters: typeof toggleFilters,
    updateConversion: typeof updateConversion,
    unitClick: typeof unitClick,
    filterKeyDown: typeof filterKeyDown,
    changeFormat: typeof changeFormat,
    setRandom: typeof setRandom,
    switchInputs: typeof switchInputs
}

export function toggleFilters(target?: HTMLInputElement) {
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
            EL_FILTERS.style.width = MIN_WIDTH + 'px';
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

export function unitClick(unitName: string, domain: eDomain) {
    const UNIT = UNITS.find(u => u.name === unitName && u.domain === domain)!;

    if (currentActiveFilter === EL_INPUT_TO) {
        toUnit = UNIT;
    } else {
        fromUnit = UNIT;
    }
    currentActiveFilter.value = UNIT.name;
    searchOriginalValue = UNIT.name;
    updateConversion();
    toggleFilters();
}

export function filterKeyDown(key: string) {
        if (searchFirstKey && key.length === 1) {
        setTimeout(() => {
            currentActiveFilter.value = key;
            filterSearch();
        });
    }
    searchFirstKey = false;
    setTimeout(() => filterSearch());
}

export function filterSearch() {
    const
        VALUE = currentActiveFilter.value.toLowerCase().replace(/[^a-z0-9]/, ''),
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
                onclick="unitClick('${ u.name }', ${ u.domain })"
            >
                ${ u.name }
            </button>
        `, '');
}

function changeFormat() {
    addPrefix = !addPrefix;
    EL_BUTTON_FORMAT.innerHTML = addPrefix ? '10<sup>x</sup>' : 'SI';
    updateConversion();
}

function setRandom(inital: boolean = false) {
    if (inital) {
        EL_INPUT_AMOUNT.value = String(
            (
                Math.floor(Math.random() * 100) *
                (10**(
                    Math.random() < 0.4 ? Math.floor(Math.random() * 20) - 10 : 0
                ))
            ) || 1
        );
        fromUnit = UNITS[Math.floor(Math.random() * UNITS.length)];
        EL_INPUT_FROM.value = fromUnit.name;
    }
    toUnit = UNITS[Math.floor(Math.random() * UNITS.length)];
    EL_INPUT_TO.value = toUnit.name;
    updateConversion();
}

function switchInputs() {
    const TO_UNIT = toUnit;
    toUnit = fromUnit;
    fromUnit = TO_UNIT;
    EL_INPUT_FROM.value = fromUnit.name;
    EL_INPUT_TO.value = toUnit.name;
    updateConversion();
}

function updateConversion() {
    const
        AMOUNT = parseFloat(EL_INPUT_AMOUNT.value),
        [FROM_VALUE, TO_VALUE, CONVERT_KG] = convert(
            AMOUNT,
            fromUnit,
            toUnit
        );

    // Background gradient
    EL_APP.dataset.from = String(FROM_VALUE.inputUnit.domain);
    EL_APP.dataset.to = String(TO_VALUE.inputUnit.domain);

    EL_INPUT_FROM_PROXY.innerHTML = fromUnit.string[AMOUNT === 1 ? 0 : 1];
    EL_INPUT_FROM_DESC.innerHTML = FROM_VALUE.toStringDescription(CONVERT_KG);
    
    const [
        STR_OUTPUT,
        STR_INPUT_PROXY,
        STR_OUTPUT_PER,
        STR_INPUT_DESC,
        HAS_PREFIX
    ] = TO_VALUE.toString(CONVERT_KG);

    EL_OUTPUT.innerHTML = STR_OUTPUT;
    EL_INPUT_TO_PROXY.innerHTML = STR_INPUT_PROXY;
    EL_OUTPUT_PER.innerHTML = STR_OUTPUT_PER;
    EL_INPUT_TO_DESC.innerHTML = STR_INPUT_DESC;

    EL_BUTTON_FORMAT.classList.toggle('inputs__button--hide', !HAS_PREFIX || !addPrefix);
    EL_OUTPUT_PER_CONTAIN.classList.toggle('inputs__output--hide', !STR_OUTPUT_PER);
}


//
// Private functions
//

function _exposeToWindow() {
    window.toggleFilters = toggleFilters;
    window.filterKeyDown = filterKeyDown;
    window.setRandom = setRandom;
    window.switchInputs = switchInputs;
    window.changeFormat = changeFormat;
    window.unitClick = unitClick;
    window.updateConversion = updateConversion;
}

function _renderFilters() {
    EL_FILTERS_BUTTONS.innerHTML = Object
        .keys(DOMAINS)
        .map(d => `
            <button
                class="
                    filters__modal-button
                    filters__modal-button--${ d }
                "
                onclick="
                    EL_UNITS.classList.toggle('filters__modal--${ d }');
                    EL_UNITS.classList.remove('filters__modal--all');
                "
            >
                ${ eDomain[parseInt(d)] }
            </button>
        `)
        .join('');

    EL_FILTERS_RESULT.innerHTML = Object
        .entries(CATEGORY_LABELS)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(e => e[1])
        .map((c, ci) => `
            <div class="filters__modal-result-category">
                <h3 class="filters__modal-result-category-header">
                    ${ c.replace(/^us([^a-z])/, 'US$1') }
                </h3>
                ${ 
                    UNITS
                        .filter(u => u.category === ci)
                        .map(u => `
                            <button
                                class="
                                    filters__modal-button
                                    filters__modal-button--${ u.domain }
                                "
                                onclick="unitClick('${ u.name }', ${ u.domain })"
                            >
                                ${ u.name }
                            </button>
                        `)
                        .join('')
                }
            </div>
        `)
        .join('');
}