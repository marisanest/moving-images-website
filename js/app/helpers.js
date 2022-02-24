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
        let filter = $(this);
        let filterValue = filter.attr('filter-value');

        if(filter.is(".image-filter, .image-author") && !filter.closest(".body-grid-item").is(':hover, .active')){
            return;
        }

        if (filter.is('.active')) {
            if (filterValue === '.about' || filterValue ==='.imprint') {
                $(".body-grid-item" + filterValue).addClass('hidden');
                filterValues = ['*'];
            } else {
                filterValues = filterValues.filter(value => value !== filterValue);
                if (!filterValues.length){
                    filterValues = ['*'];
                }
            }

            $(".filter.active[filter-value='" + filterValue + "']").removeClass('active');
        } else {
            if (filterValues.includes('*')) {
                filterValues = [];
            }

            if (filterValues.includes('.about') || filterValues.includes('.imprint')) {
                $("[filter-value='.about'],[filter-value='.imprint']").removeClass('active');
                filterValues = [];
            }

            if (filterValue === '.about' || filterValue ==='.imprint') {
                $(".filter").removeClass('active');
                if($(".collapsible").hasClass('active')) {$(".collapsible").click()}
                $(".body-grid-item" + filterValue).removeClass('hidden');
                filterValues = [filterValue];
            } else {
                filterValues.push(filterValue);
            }

            $("[filter-value='" + filterValue + "']").addClass('active');
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

function initImages() {
    let images = $(".body-grid-item.image");

    if (window.matchMedia('(hover: hover)').matches) {
        $(".image-edit").remove();

        images.click(function(event) {
            let image = $(this);
            let eventTarget = $(event.target);

            if(!eventTarget.is(".image-filter, .image-author")){
                window.location = image.attr('href');
            }
        });
    } else {
        images.click(function(event) {
            let image = $(this);
            let eventTarget = $(event.target);

            if (image.is('.active')){
                if(eventTarget.is(".image-edit-title, .image-title")){
                    window.location = image.attr('href');
                } else if (!eventTarget.is(".image-filter, .image-author")) {
                    image.removeClass("active");
                }
            } else {
                $(".body-grid-item.active").removeClass("active");
                image.addClass("active");
            }
        });
    }

    images.css({'height': images.width() + 'px'});
    $('.body-grid').isotope();
}