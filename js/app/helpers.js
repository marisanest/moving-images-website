function prepareData(data) {
    let preparedData = JSON.parse(JSON.stringify(data));
    preparedData.filters = [];

    prepareImagesData(preparedData);
    prepareFiltersData(preparedData, data);
    preparedData.students.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    return preparedData;
}

function prepareImagesData(data) {
    data.images.forEach(image => {
        image.filters = {
            "joined": Object.values(image.filters).flat().join(" "),
            "separate": Object.entries(image.filters).map(([type, values]) => prepareFilterEntry(type, values)),
        }
    });
}

function prepareFiltersData(preparedData, data) {
    data.images.forEach(image => {
        Object.entries(image.filters).forEach(([type, values]) => {
            let types = preparedData.filters.map(filter => filter.type.lower);
            if(types.includes(type)){
                let idx = types.findIndex(t => t === type);
                values.forEach(value => {
                    if(!preparedData.filters[idx].values.map(value => value.lower).includes(value)) {
                        preparedData.filters[idx].values.push(prepareLowerUpperText(value));
                        preparedData.filters[idx].values.sort((a,b) => (a.upper > b.upper) ? 1 : ((b.upper > a.upper) ? -1 : 0));
                    }
                })
            } else {
                preparedData.filters.push(prepareFilterEntry(type, values));
            }
        })
    });
}

function prepareFilterEntry(type, values) {
    return {
        "type": prepareLowerUpperText(type),
        "values": values.map(value => prepareLowerUpperText(value))
    }
}

function prepareLowerUpperText(value) {
    return {
        "lower": value,
        "upper": value.charAt(0).toUpperCase() + value.substring(1)
    }
}


function prepareFilterfiltering(data) {
    let entrys = [];

    data.images.forEach(image => {
        entrys.push(Object.values(image.filters).flat());
    });
    return entrys;
}


function initIsotope(grid) {
    $('.' + grid).isotope({
        itemSelector: '.' + grid + '-item',
        masonry: {
            columnWidth: '.' + grid + '-sizer',
            percentPosition: true,
        }
    });
    $('.body-grid').isotope('shuffle')
}


function filterFilters(entrys) {
    $('.filter').click(function() {
        let active = []
        $('.filter-items > .is-checked').map(function() {
            active.push($(this).attr('data-filter').substring(1));
        });

        let all = []
        $('.filter-items > .filter').map(function() {
            all.push($(this).attr('data-filter').substring(1));
        });

        let matching = [];

        entrys.forEach(filters => {
            if(active.every(val => filters.includes(val))) {
                filters.forEach(val => {
                    if(!matching.includes(val)) {
                        matching.push(val);
                    }
                });
            }
        });

        all.filter(x => !matching.includes(x)).forEach(filter => {
            $('.filter-items > .' + filter).removeClass('show').addClass('hide');
        });

        matching.forEach(filter => {
            $('.filter-items > .' + filter).removeClass('hide').addClass('show');
        });
    })
}


function initFilters() {
    let filterValues = [];

    $('.filter').click(function() {
        let filterValue = $(this).attr('data-filter');

        if ($(this).is('.is-checked')) {
            if (filterValue === '.about' || filterValue ==='.imprint') {
                $(".body-grid-item" + filterValue).addClass('hidden');
                filterValues = ['*'];
            } else {
                filterValues = filterValues.filter(value => value !== filterValue);
                if (!filterValues.length){
                    filterValues = ['*'];
                }
            }

            $(".filter.is-checked[data-filter='" + filterValue + "']").removeClass('is-checked');
        } else {
            if (filterValues.includes('*')) {
                filterValues = [];
            }

            if (filterValues.includes('.about') || filterValues.includes('.imprint')) {
                $("[data-filter='.about'],[data-filter='.imprint']").removeClass('is-checked');
                filterValues = [];
            }

            if (filterValue === '.about' || filterValue ==='.imprint') {
                $(".filter").removeClass('is-checked');
                if($(".collapsible").hasClass('active')) {$(".collapsible").click()}
                $(".body-grid-item" + filterValue).removeClass('hidden');
                filterValues = [filterValue];
            } else {
                filterValues.push(filterValue);
            }

            $("[data-filter='" + filterValue + "']").addClass('is-checked');
        }

        $('.body-grid').isotope({filter: filterValues.join('')});
    });
}

function initCollapsible() {
    $('.collapsible').click(function() {
        let collapsible = $(this);
        collapsible.toggleClass("active");
        let filterList = $('.category-menu');

        if (filterList.css('maxHeight') != '0px'){
            filterList.css('maxHeight', '0px');
            $('.category-menu-wrapper').css('padding-bottom', "0rem");
        } else {
            filterList.css('maxHeight', filterList.prop('scrollHeight') + "px");
            $('.category-menu-wrapper').css('padding-bottom', "0.5rem");
        }
    });
}