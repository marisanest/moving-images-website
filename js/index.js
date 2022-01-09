let grid = $('.grid');
let filtersWrapper = $('.filters-wrapper');

grid.isotope({
    itemSelector: '.grid-item',
    masonry: {
        columnWidth: '.grid-sizer',
        gutter: 20
    }
});

let stampElem = $('.stamp');
grid.isotope('stamp', stampElem);

filtersWrapper.on( 'click', '.filter', function() {
    filtersWrapper.find('.is-checked').removeClass('is-checked');
    $( this ).addClass('is-checked');
    let filterValue = $( this ).attr('data-filter');
    grid.isotope({ filter: filterValue });
});

