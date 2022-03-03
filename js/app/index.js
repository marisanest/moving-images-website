$(document).ready(function() {
    fetch("../data/data.json", {
        headers: {
            'Concept-type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => prepareData(data))
        .then(function(preparedData) {
            initHtml(preparedData);
            initIsotope();
            initCallbacks(preparedData);
            filterWithFragmentIdentifier();
            Splitting()
        })
});


