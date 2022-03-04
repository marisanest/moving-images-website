# moving-images-website

## How to add your sketch to the website

Please submit your shader in the following format: 
* upload *Firstname_NameOfMyShader.frag* (respect upper and lower case) to `public/shaders`.
* upload a screenshot of your shader in the dimensions 512x512 as *Firstname_NameOfMyShader.png* to `public/images`.
* create a new entry in the `public/json/data.json` file with all necessary information. Below the current template:
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
* to add your name to the student list enter your name and a link to the students section in the `public/json/data.json` file.

  ```
  {
    "name": "Alex",
    "link":  "alex-example.com",
  },
  
  ```
To use textures upload your image into the folder `public/textures/`. In your shader add the URL as a comment next to the texture uniform. See [template_texture.frag](https://github.com/marisanest/moving-images-website/blob/7557c29ccd902b1aad377ac39bf97c41c4214166/data/textures/template_texture.frag#L8) for reference.



The lessons for the course can be found in [this repo](https://github.com/edap/udk-shaders)
