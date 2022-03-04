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

function initIsotope() {
    let bodyGrid = $('.body-grid');
    bodyGrid.isotope({
        itemSelector: '.body-grid-item',
        masonry: {
            columnWidth: '.body-grid-sizer',
            percentPosition: true,
        }
    });
    bodyGrid.isotope('shuffle')
}

function filterImages(filter, activeFilterValues) {
    let filterValue = filter.attr('filter-value');

        if(filter.is('.hide') || (filter.is(".image-filter") && (window.matchMedia('(hover: none)').matches && !filter.closest(".body-grid-item").is('.active')))){
            return;
        }

    if (filter.is('.active')) {
        if (filterValue === '.about') {
            $(".body-grid-item" + filterValue).addClass('hidden');
            activeFilterValues = ['*'];
        } else {
            activeFilterValues = activeFilterValues.filter(value => value !== filterValue);
            if (!activeFilterValues.length){
                activeFilterValues = ['*'];
            }
        }

        $(".filter.active[filter-value='" + filterValue + "']").removeClass('active');
    } else {
        if (activeFilterValues.includes('*')) {
            activeFilterValues = [];
        }

        if (activeFilterValues.includes('.about')) {
            $(".about").addClass('hidden');
            $("[filter-value='.about']").removeClass('active');
            activeFilterValues = [];
        }

        if (filterValue === '.about') {
            $(".filter, .body-grid-item.active").removeClass('active');

            if($(".collapsible").hasClass('active')) {
                $(".collapsible").click()
            }

            $(".body-grid-item" + filterValue).removeClass('hidden');
            activeFilterValues = [filterValue];
        } else {
            activeFilterValues.push(filterValue);
        }

        $("[filter-value='" + filterValue + "']").addClass('active');
    }

    $('.body-grid').isotope({filter: activeFilterValues.join('')});

    return activeFilterValues;
}

function filterFilters(allFilterValues, allFilterValuesPerImage, activeFilterValues) {
    if (activeFilterValues.includes('*') || activeFilterValues.includes('.about') ) {
        activeFilterValues = [];
    }

    let possibleFilterValues = [];
    allFilterValuesPerImage.forEach(filterValuesPerImage => {
        if(activeFilterValues.every(filterValue => filterValuesPerImage.includes(filterValue.substring(1)))) {
            filterValuesPerImage.forEach(filterValue => {
                if(!possibleFilterValues.includes(filterValue)) {
                    possibleFilterValues.push(filterValue);
                }
            });
        }
    });

    allFilterValues
        .filter(filterValue => !possibleFilterValues.includes(filterValue))
        .forEach(filterValue => $(".filter-items > .filter[filter-value='."+ filterValue + "']").removeClass('show').addClass('hide').addClass('no-select'));

    possibleFilterValues
        .forEach(filterValue => $(".filter-items > .filter[filter-value='."+ filterValue + "']").addClass('show').removeClass('hide').removeClass('no-select'));
}

function initFilterCallbacks(preparedData) {
    let allFilterValues = preparedData.filters.map(filterType => filterType.values.map(value => value.lower)).flat();
    let allFilterValuesPerImage = preparedData.images.map(image => image.filters.separate.map(f => f.values.map(x => x.lower)).flat());
    let activeFilterValues = [];

    $('.filter').click(function() {
        let filter = $(this);

        if(filter.is('.hide') || (filter.is(".image-filter") && (window.matchMedia('(hover: none)').matches && !filter.closest(".body-grid-item").is('.active')))){
            return;
        }
        activeFilterValues = filterImages(filter, activeFilterValues);
        filterFilters(allFilterValues, allFilterValuesPerImage, activeFilterValues);
        updateFragmentIdentifier(activeFilterValues[0]);
        window.scrollTo(0, 0);
    });
}

function initCollapsibleCallbacks() {
    $('.collapsible').click(function() {
        let collapsible = $(this);
        collapsible.toggleClass("active");
        let categoryMenuWrapper = $('.category-menu-wrapper');
        let categoryMenu = $('.category-menu');

        if (categoryMenu.css('maxHeight') !== '0px'){
            categoryMenu.css('maxHeight', '0px');
            categoryMenuWrapper.css('padding-top', "var(--no-gapping)");
            categoryMenuWrapper.css('padding-bottom', "var(--no-gapping)");
        } else {
            categoryMenu.css('maxHeight', categoryMenu.prop('scrollHeight') + "px");
            categoryMenuWrapper.css('padding-top', "var(--small-gapping)");
            categoryMenuWrapper.css('padding-bottom', "calc(var(--medium-gapping) - var(--small-gapping))");
        }
    });
}

function initImageCallbacks() {
    let images = $(".body-grid-item.image");

    if (window.matchMedia('(hover: hover)').matches) {
        $(".image-edit").remove();

        images.click(function(event) {
            let image = $(this);
            let eventTarget = $(event.target);

            if(!eventTarget.is(".image-filter")){
                window.location = image.attr('href');
            }
        });
    } else {
        images.click(function(event) {
            let image = $(this);
            let eventTarget = $(event.target);

            if (image.is('.active')){
                if(eventTarget.is(".image-edit")){
                    window.location = image.attr('href');
                } else if (!eventTarget.is(".image-filter")) {
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

function filterWithFragmentIdentifier() {
    if (window.location.hash.includes("#")) {
        let filterValue = window.location.hash.split('?')[0].substring(1);
        if (filterValue !== ""){
            $(".filter-items > .filter[filter-value='." + filterValue + "'], .about-menu-title.filter[filter-value='." + filterValue + "']").click();
        }
    }
}

function updateFragmentIdentifier(filterValue) {
    if (filterValue === "*") {
        window.location.replace("#");
        if (typeof window.history.replaceState == 'function') {
            history.replaceState({}, '', window.location.href.slice(0, -1));
        }
    } else {
        window.location.hash = filterValue.substring(1);
    }
}

function initHtml(preparedData) {
    $("body")
        .html(
            Mustache.to_html(
                $("#template").html(),
                preparedData
            )
        );
}

function initWindowCallbacks() {
    $(window).resize(function() {
        if ($('.collapsible').hasClass('active')) {
            let categoryMenu = $('.category-menu');
            categoryMenu.css('max-height', categoryMenu.prop('scrollHeight') + "px");
        }

        let images = $(".body-grid-item.image");
        images.css({'height': images.width() + 'px'});
        $('.body-grid').isotope();
    });
}

function initCallbacks(preparedData) {
    initFilterCallbacks(preparedData);
    initCollapsibleCallbacks();
    initImageCallbacks();
    initWindowCallbacks();
}