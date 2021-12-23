# moving-images-website

## How to add your sketch to the website

Add a file 'yourShader.frag' in the `shaders` folder. Add an image with a link to `shaders/index.html?data=yourShader.frag` in the index.html page.

To use textures upload the your file into the folder `shaders/textures`. In your shader add the URL as a comment next to the texture uniform. See [template_texture.frag](shaders/template_texture.frag) for reference.

## TODO

- Add isotype filter
- Make a nice layout
