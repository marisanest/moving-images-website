$(document).ready(function() {
    let params = {};
    location.search.slice(1).split("&").forEach(function(pair) {
        pair = pair.split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    });
    document.title = params.data.split('.')[0].replace('_', " - ").replace(/([a-z])([A-Z])/g, '$1 $2');

    if (params['data'] !== null && params['data'].endsWith('.frag')){
        let srcFile = params['data'];
        const glslEditor = new GlslEditor('#glsl_editor', {
            canvas_size: window.innerWidth * 0.5,
            canvas_draggable: true,
            theme: 'monokai',
            multipleBuffers: true,
            tooltips: true,
            watchHash: true,
            fileDrops: true,
            menu: false,
        });
        glslEditor.open("/data/shaders/" + srcFile);
    }
});