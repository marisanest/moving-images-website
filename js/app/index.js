const shadersTemplate = {
    '<>':'div', 'class': function(){return('body-grid-item ' + this.filters.join(" "))}, 'html': [
        {'<>':'div', 'class': 'image-caption-wrapper', 'html': [
                {'<>':'div', 'class': 'image-wrapper', 'html': [
                        {'<>':'a', 'class': 'image-link', 'href':'/app/show.html?data=${filename}.frag', 'html': [
                                {'<>':'img', 'class': 'image', 'src':"/data/images/${filename}.png", 'alt':"#"}]
                        }]
                },
                {'<>':'div', 'class':'caption small', 'html': [
                        {'<>':'a', 'href':'/app/show.html?data=${filename}.frag', 'text':'${author} - ${title}'}]
                },

                {"<>":"div", "class": "filter-menu overlay", "html":[
                    {"<>":"a", "obj":function(){return(this.filters);}, "href": "#", "class": "filter overlay", "data-filter": ".${value}", "text": function(){return(this.value.charAt(0).toUpperCase()+this.value.substring(1))}}]
                }]
        }]
};

const menuTemplate = {
    '<>':'div', 'class': 'body-grid-item grid-item--width2 ${filters}', 'html': [
        {'<>':'div', 'class': 'image-caption-wrapper', 'html': [
                {'<>':'div', 'class': 'small', 'html': [
                        {'<>':'p', 'class': 'medium', 'text':'${title}'}], 'text':'${text}'
                }]
        }]
};

fetch("/data/data.json", {
    headers: {
        'Concept-type': 'application/json',
        'Accept': 'application/json'
    }
})
    .then(resp => resp.json())
    .then(data => {
        let bodyGrid = $('.body-grid');
        bodyGrid.json2html(data["shaders"], shadersTemplate);
        bodyGrid.json2html(data["menu"], menuTemplate);
    })
    .then(_ => {
        $(window).resize(function() {
            let cachedWidth = $(window).width();
            if ($(window).width() != cachedWidth) {
                $('.collapsible').toggleClass("active", false)
                $('.filter-menu').css('height', '');
                $('.filters').css('maxHeight', '');
            }
        });

        let headerGrid = $('.header-grid');
        headerGrid.isotope({
            itemSelector: '.header-grid-item',
            masonry: {
                columnWidth: '.header-grid-sizer',
                percentPosition: true,
            }
        });

        let bodyGrid = $('.body-grid');
        bodyGrid.isotope({
            itemSelector: '.body-grid-item',
            masonry: {
                columnWidth: '.body-grid-sizer',
                percentPosition: true,
            }
        });

        let filterMenu = $('.filter-menu');
        filterMenu.on( 'click', '.filter', function() {
            let filterValue;
            if ($(this).is('.is-checked')) {
                filterValue = '*';
                $('.filter-menu .is-checked').removeClass('is-checked');
                console.log($('.filter-menu .is-checked'))
            } else {
                filterValue = $(this).attr('data-filter');
                $('.filter-menu .is-checked').removeClass('is-checked');
                $(".filter-menu [data-filter='"+filterValue+"']").addClass('is-checked');
            }
            bodyGrid.isotope({filter: filterValue});
        });

        $('.collapsible').on("click", function() {
            currents = $(this);
            currents.toggleClass("active");

            let parents = currents.closest('.filter-menu');
            let contents = currents.next();

            if (contents.css('maxHeight') != '0px'){
                contents.css('maxHeight', '0px');
                parents.css('height', parents.outerHeight() - contents.outerHeight() + "px");
            } else {
                contents.css('maxHeight', contents.prop('scrollHeight') + "px");
                parents.css('height', parents.outerHeight() + contents.prop('scrollHeight') + "px");
            }
            headerGrid.masonry();
        });
    });