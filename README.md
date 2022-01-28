# moving-images-website

## How to add your sketch to the website

Please submit your shader in the following format: 
* upload *Firstname_NameOfMyShader.frag* (respect upper and lower case) to `data/shaders`.
* upload a screenshot of your shader in the dimensions 512x512 as *Firstname_NameOfMyShader.png* to `data/images`.
* create a new entry in the `data/data.json` file with all necessary information. Below the current template:
  ```
  {
    "filename": "Alex_PulseAh",
    "title":  "Pulse Ah",
    "author": "Alex",
    "filters": {
      "color": ["black", "..."],
      "shapes": ["circle", "rectangle" "..."],
      "category": ["pattern", "noise" "..."]
    },
    "format": "1:1"
  }
  ```
To use textures upload your image into the folder `data/textures/`. In your shader add the URL as a comment next to the texture uniform. See [template_texture.frag](https://github.com/marisanest/moving-images-website/blob/108672c1e7638b19cbbb1f1baf713abc56f5b82d/shaders/template_texture.frag#L8) for reference.

The lessons for the course can be found in [this repo](https://github.com/edap/udk-shaders)
