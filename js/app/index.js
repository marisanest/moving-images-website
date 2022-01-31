$(document).ready(function() {
    let image_template = {
        '<>':'div', 'class': function(){return('body-grid-item ' + this.filters.join(" "))}, 'html': [
            {'<>':'div', 'class': 'image-caption-wrapper', 'html': [
                    {'<>':'div', 'class': 'image-wrapper', 'html': [
                            {
                                '<>': 'a', 'class': 'image-link', 'href': '/app/show.html?data=${filename}.frag', 'html': [
                                    {'<>': 'img', 'class': 'image', 'src': "/data/images/${filename}.png"}]
                            }]
                    },
                    {'<>':'div', 'class':'caption small', 'html': [
                            {'<>':'a', 'href':'/app/show.html?data=${filename}.frag', 'text':'${author} - ${title}'}]
                    },

                    {"<>":"div", "class": "filters overlay", "html":[
                            {"<>":"a", "obj":function(){return(this.filters)}, "href": "#", "class": "filter overlay", "data-filter": ".${value}", "text":function(){return this.value.charAt(0).toUpperCase() + this.value.substring(1)}}]
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

    let filter_template = {
        "<>":"ul", 'html': [
            {'<>':'a', "href": "#", 'class':'filter small-medium', 'data-filter':'.${value}', "text":function(){return this.value.charAt(0).toUpperCase() + this.value.substring(1)}
            }]
    }

    let headerGrid = $('.header-grid');
    let bodyGrid = $('.body-grid');
    let filterList = $('.filter-list');

    fetch("/data/data.json", {
        headers: {
            'Concept-type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(resp => resp.json())
        .then(data => {
            bodyGrid.json2html(data["images"], image_template);
            bodyGrid.json2html(data["texts"], text_template);

            let filters = new Set();
            for (let image of data["images"]) {
                for (let filter of image["filters"]) {
                    filters.add(filter);
                }
            }
            filterList.json2html(Array.from(filters).sort(), filter_template);

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
                    $(".filter[data-filter='"+filterValue+"']").addClass('is-checked');

                    if ($(this).is('#aboutButton') || $(this).is('#imprintButton')) {
                        $('#about,#imprint').addClass('hidden')
                        $($(this).attr('data-filter')).removeClass('hidden');
                    }
                }
                bodyGrid.isotope({filter: filterValue});
            });

            $('.collapsible').click(function() {
                let collapsible = $(this);
                collapsible.toggleClass("active");
                let filters = collapsible.closest('.filters');
                let filterList = collapsible.next();

                if (filterList.css('maxHeight') != '0px'){
                    filterList.css('maxHeight', '0px');
                    filters.css('height', filters.outerHeight() - filterList.outerHeight() + "px");
                } else {
                    filterList.css('maxHeight', filterList.prop('scrollHeight') + "px");
                    filters.css('height', filters.outerHeight() + filterList.prop('scrollHeight') + "px");
                }
                headerGrid.masonry();
            });
        });
});