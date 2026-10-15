export default function(domains, categories, units) {
    return `
        <div
            id="EL_FILTERS"
            class="filters"
        >
            <div
                id="EL_UNITS"
                class="filters__modal"
            >
                <div class="filters__modal-select">
                    ${ Object.keys(domains).reduce((htm, d) => htm + `
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
                            ${ d }
                        </button>
                    `, '') }
                    <button
                        class="
                            filters__modal-button
                            filters__modal-button--all
                        "
                        onclick="
                            EL_UNITS.setAttribute(
                                'class',
                                'filters__modal ' + 
                                (EL_UNITS.classList.contains('filters__modal--all') ? '' : 'filters__modal--all')
                            );
                        "
                    >
                        All Units
                    </button>
                </div>
                <div class="filters__modal-result">
                    ${ categories.reduce((htmc, c) => htmc + `
                        <div class="filters__modal-result-category">
                            <h3 class="filters__modal-result-category-header">
                                ${ c.replace(/(^| )us/, '$1US') }
                            </h3>
                            ${ units.filter(u => u.category === c).reduce((htmu, u) => htmu + `
                                <button
                                    class="
                                        filters__modal-button
                                        filters__modal-button--${ u.domain }
                                    "
                                    onclick="unitClick('${ u.name }', '${ u.domain }')"
                                >
                                    ${ u.name }
                                </button>
                            `, '')}
                        </div>
                    `, '')}
                </div>
                <div
                    id="EL_FILTERS_SEARCH"
                    class="filters__modal-search"
                ></div>
            </div>
            <div
                class="filters__scrim"
                onclick="toggleFilters()"
            ></div>
        </div>
    `;
}