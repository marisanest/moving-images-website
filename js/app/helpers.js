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
    $('.filter').click(function() {
        let filterValue;

        if ($(this).is('.is-checked')) {
            filterValue = '*';
            $('.filter.is-checked').removeClass('is-checked');

            if ($(this).is('#aboutButton') || $(this).is('#imprintButton')) {
                $($(this).attr('data-filter')).addClass('hidden');
            }

        } else {
            filterValue = $(this).attr('data-filter');
            $('.filter.is-checked').removeClass('is-checked');
            $('#about, #imprint').addClass('hidden')
            $(".filter[data-filter='"+filterValue+"']").addClass('is-checked');

            if ($(this).is('#aboutButton') || $(this).is('#imprintButton')) {
                $($(this).attr('data-filter')).removeClass('hidden');
            }
        }
        $('.body-grid').isotope({filter: filterValue});
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