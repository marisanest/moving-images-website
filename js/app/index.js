$(document).ready(function() {
    fetch("../data/data.json", {
        headers: {
            'Concept-type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(resp => resp.json())
        .then(data => {
            $("body")
                .html(
                    Mustache.to_html(
                        $("#template").html(),
                        prepareData(data)
                    )
                );
        })
        .then(() => {
            initIsotope("header-grid");
            initIsotope("body-grid");
            initFilters();
            initCollapsible();
            initImages();
        });
});

$(window).resize(function() {
    if ($('.collapsible').hasClass('active')) {
        let categoryMenu = $('.category-menu');
        categoryMenu.css('max-height', categoryMenu.prop('scrollHeight') + "px");
    }

    let images = $(".body-grid-item.image");
    images.css({'height': images.width() + 'px'});
    $('.body-grid').isotope();
});