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
    } else {
        filterValue = $(this).attr('data-filter');
        filterMenu.find('.is-checked').removeClass('is-checked');
    }
    $(this).toggleClass('is-checked')
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