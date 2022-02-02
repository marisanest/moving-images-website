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
        });
});

$(window).resize(function() {
    let cachedWidth = $(window).width();
    if ($(window).width() !== cachedWidth) {
        let categoryMenu = $('.category-menu');
        categoryMenu.css('height', categoryMenu.prop('scrollHeight') + "px");
    }
});