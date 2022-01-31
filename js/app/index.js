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
                            {"<>": "div", "class": "flexoverlay", "html": [
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

    let filter_template = {
        '<>':'div', 'obj':function(){return this}, 'class':'filter-list', 'html':[
                {'<>':'span', 'class': 'filtertype small', 'html':function(){return Object.keys(this).join().charAt(0).toUpperCase() + Object.keys(this).join().substring(1)+":"}},
                {'<>':'div', 'class':function(){return Object.keys(this).join()}, 'html': [
                        {'<>':'a', 'obj':function(){return Object.values(this).flat()}, 'href':'#','class':'filter small ${value}','data-filter':'.${value}',"text":function(){return this.value.charAt(0).toUpperCase() + this.value.substring(1)}}]
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

            let allFilters = [];

            for (let image of data.images) {
                for (let filtertype in image.filters) {
                    if(!(allFilters.some(e => e.hasOwnProperty(filtertype)))) {
                        allFilters.push( {[filtertype]: image.filters[filtertype] })
                    } else {
                        idx = allFilters.findIndex(obj => obj.hasOwnProperty(filtertype));
                        allFilters[idx][filtertype] = allFilters[idx][filtertype].concat(image.filters[filtertype].filter((item) => allFilters[idx][filtertype].indexOf(item) < 0))
                    }
                    
                }

            }
            category.json2html(allFilters, filter_template);

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