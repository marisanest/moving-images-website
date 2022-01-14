let headerGrid = $('.header-grid');
headerGrid.isotope({
    itemSelector: '.header-grid-item',
    masonry: {
        columnWidth: '.header-grid-sizer',
        percentPosition: true
    }
});

let bodyGrid = $('.body-grid');
bodyGrid.isotope({
    itemSelector: '.body-grid-item',
    masonry: {
        columnWidth: '.body-grid-sizer',
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

let collapsible = $('.collapsible')
let initHeight = headerGrid.css("height");
collapsible.on("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
        content.style.maxHeight = null;
        headerGrid.css("height", initHeight);
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        // a hack but it works
        headerGrid.css("height", content.getBoundingClientRect().top + content.scrollHeight + "px");
    } 
});