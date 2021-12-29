let grid = $('.grid').isotope({
    itemSelector: '.grid-item',
    percentPosition: true,
    masonry: {
        columnWidth: '.grid-sizer'
    }
});

$('.filters-button-group').on( 'click', 'button', function() {
    let filterValue = $( this ).attr('data-filter');
    grid.isotope({ filter: filterValue });
});

$('.button-group').each( function( i, buttonGroup ) {
    let $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function() {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $( this ).addClass('is-checked');
    });
});