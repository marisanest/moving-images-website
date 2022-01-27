$(document).ready(function() {
    let image_template = {
        '<>':'div', 'class': function(){return('body-grid-item ' + Object.values(this.filters).join().replaceAll(",", " "))}, 'html': [
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

                    {"<>":"div", "class": "filters overlay extra-small", "html": [
                            {"<>": "div", "class": "flexoverlay", "html": [
                                {"<>":"a", "obj":function(){return(Object.values(this.filters).flat())}, "href": "#", "class": "filter overlay", "data-filter": ".${value}", "text":function(){return this.value.charAt(0).toUpperCase() + this.value.substring(1)}}]
                            }]                    
                    }]
            }]
    };

    let text_template = {
        '<>':'div', 'class': 'body-grid-item grid-item--width2 ${filters}', 'html': [
            {'<>':'div', 'class': 'image-caption-wrapper', 'html': [
                    {'<>':'div', 'class': 'small', 'html': [
                            {'<>':'p', 'class': 'medium', 'text':'${title}'}], 'text':'${text}'
                    }]
            }]
    };

    let filter_template = {
        '<>':'div', 'obj':function(){return (this.filters)}, 'class':'filter-list', 'html':[
                {'<>':'span', 'class': 'filtertype small', 'html':function(){return Object.keys(this).join().charAt(0).toUpperCase() + Object.keys(this).join().substring(1)+":"}},
                {'<>':'div', 'class':function(){return(Object.keys(this).join())}, 'html': [
                        {'<>':'a', 'obj':function(){return (Object.values(this).flat())}, 'href':'#','class':'filter small ${value}','data-filter':'.${value}',"text":function(){return this.value.charAt(0).toUpperCase() + this.value.substring(1)}}]
                }]
        };

    let headerGrid = $('.header-grid');
    let bodyGrid = $('.body-grid');
    let category = $('.category-menu');

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

            let filters = {
                "filters": [
                    {"color": [] },
                    {"shapes": [] },
                    {"category": [] }
                ]
            };

            data.images.map(function(filtertype){
                filters.filters[0].color.push.apply(filters.filters[0].color, filtertype.filters.color.filter((item) => filters.filters[0].color.indexOf(item) < 0));
                filters.filters[1].shapes.push.apply(filters.filters[1].shapes, filtertype.filters.shapes.filter((item) => filters.filters[1].shapes.indexOf(item) < 0));
                filters.filters[2].category.push.apply(filters.filters[2].category, filtertype.filters.category.filter((item) => filters.filters[2].category.indexOf(item) < 0));
            });
            category.json2html(filters, filter_template);

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
                } else {
                    filterValue = $(this).attr('data-filter');
                    $('.filter.is-checked').removeClass('is-checked');
                    $(".filter[data-filter='"+filterValue+"']").addClass('is-checked');
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