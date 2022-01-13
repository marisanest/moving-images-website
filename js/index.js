let headerGrid = $('.header-grid');
headerGrid.isotope({
    itemSelector: '.header-grid-item',
    masonry: {
        columnWidth: '.header-grid-sizer',
        // gutter: 20,
        percentPosition: true
    }
});

let bodyGrid = $('.body-grid');
bodyGrid.isotope({
    itemSelector: '.body-grid-item',
    masonry: {
        columnWidth: '.body-grid-sizer',
        // gutter: 20,
        percentPosition: true
    }
});

let filters = $('.filters');
filters.on( 'click', '.filter', function() {
    filters.find('.is-checked').removeClass('is-checked');
    $( this ).addClass('is-checked');
    let filterValue = $( this ).attr('data-filter');
    bodyGrid.isotope({ filter: filterValue });
});