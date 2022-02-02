function prepareData(data) {
    let preparedData = JSON.parse(JSON.stringify(data));
    preparedData.filters = [];

    prepareImagesData(preparedData);
    prepareFiltersData(preparedData, data);

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


function initIsotope(grid) {
    $('.' + grid).isotope({
        itemSelector: '.' + grid + '-item',
        masonry: {
            columnWidth: '.' + grid + '-sizer',
            percentPosition: true,
        }
    });
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
        } else {
            filterList.css('maxHeight', filterList.prop('scrollHeight') + "px");
        }
    });
}