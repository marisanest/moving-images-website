$(document).ready(function() {
    let image_template = {
        '<>':'div', 'class': function(){return('body-grid-item ' + this.author + ' ' + Object.values(this.filters).join().replaceAll(",", " "))}, 'html': [
            {'<>':'div', 'class': 'image-caption-wrapper', 'html': [
                    {'<>':'div', 'class': 'image-wrapper', 'html': [
                            {
                                '<>': 'a', 'class': 'image-link', 'href': '../app/show.html?data=${filename}.frag', 'html': [
                                    {'<>': 'img', 'class': 'image', 'src': "../data/images/${filename}.png"}]
                            }]
                    },
                    {'<>':'div', 'class':'caption small', 'html': [
                            {'<>':'a', 'class': 'filter', "data-filter": ".${author}", 'href':'#', 'text':'${author}'},
                            {'<>':'a', 'href':'../app/show.html?data=${filename}.frag', 'text':' - ${title}'}]
                    },

                    {"<>":"div", "class": "filters overlay extra-small", "html": [
                            {"<>": "div", "class": "flex-overlay", "html": [
                                {"<>":"a", "obj":function(){return(Object.values(this.filters).flat())}, "href": "#", "class": "filter overlay", "data-filter": ".${value}", "text":function(){return this.value.charAt(0).toUpperCase() + this.value.substring(1)}}]
                            }]                    
                    }]
            }]
    };

    let text_template = {
        '<>':'div', 'id': '${filters}',  'class': 'hidden body-grid-item grid-item--width2 ${filters}', 'html': [
            {'<>':'div', 'class': 'image-caption-wrapper', 'html': [
                    {'<>':'div', 'class': 'medium', 'html': [
                            {'<>':'p', 'class': 'medium', 'text':'${title}'}], 'text':'${text}'
                    }]
            }]
    };

    let headerGrid = $('.header-grid');
    let bodyGrid = $('.body-grid');
    let category = $('.category-menu');

    fetch("../data/data.json", {
        headers: {
            'Concept-type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(resp => resp.json())
        .then(data => {
            bodyGrid.json2html(data["images"], image_template);
            bodyGrid.json2html(data["texts"], text_template);

            let filterMap = new Map();

            for (let image of data.images) {
                for (let filterType in image.filters) {
                    if(filterMap.has(filterType)) {
                        filterMap.set(filterType, filterMap.get(filterType).add(...image.filters[filterType]))
                    } else {
                        filterMap.set(filterType, new Set(image.filters[filterType]))
                    }
                }
            }

            let filterDict = {"filters": []};
            filterMap.forEach(function(values, key) {
                filterDict["filters"].push({"filter": {"type": key, "values": [...values]}});
            });

            $(".category-menu")
                .html(
                    Mustache.to_html(
                        $("#filter-template").html(),
                        filterDict
                    )
                );
        })
        .then(() => {
            headerGrid.isotope({
                itemSelector: '.header-grid-item',
                masonry: {
                    columnWidth: '.header-grid-sizer',
                    percentPosition: true,
                }
            });

            bodyGrid.isotope({
                itemSelector: '.body-grid-item',
                masonry: {
                    columnWidth: '.body-grid-sizer',
                    percentPosition: true,
                }
            });

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
                    $('#about,#imprint').addClass('hidden')
                    $(".filter[data-filter='"+filterValue+"']").addClass('is-checked');

                    if ($(this).is('#aboutButton') || $(this).is('#imprintButton')) {
                        $($(this).attr('data-filter')).removeClass('hidden');
                    }
                }
                bodyGrid.isotope({filter: filterValue});
            });

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
        });
});

$(window).resize(function() {
    let cachedWidth = $(window).width();
    if ($(window).width() != cachedWidth) {
        $('.category-menu').css('height', $('.category-menu').prop('scrollHeight') + "px");
    }
});