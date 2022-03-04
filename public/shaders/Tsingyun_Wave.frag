#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float strokeCircle(vec2 coord,float radius, float thickness){  
    return step(thickness, abs(distance(coord, vec2(0.5)) - radius));       
}

mat2 scale(vec2 s){
return mat2(s.x, 0.0, 0.0, s.y);
}

vec3 gradientCol( vec2 coord){
    vec3 color = vec3(0.);
    color += sin(coord.x * cos(u_time / 60.0) * 60.0) + sin(coord.y * cos(u_time / 60.0) * 10.0);
	  color += cos(coord.y * sin(u_time / 30.0) * 10.0) + cos(coord.x * sin(u_time / 20.0) * 10.0);

	color *= sin(u_time / 10.0) * 0.5;
    return color;
}

void main(){
/////////////// base pattern
  vec2 coord_01 = gl_FragCoord.xy * 1.0 - u_resolution;
  
// declare rgb respectively
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

// scale coord01
  coord_01 = scale(vec2(sin(u_time*0.01) * 1.9)) * coord_01;

  r += abs(cos(coord_01.x / 30.0) + sin(coord_01.y / 10.0) - cos(u_time));
  g += abs(cos(coord_01.x / 2.0) + sin(coord_01.y / 15.0) - cos(u_time));
  b += abs(cos(coord_01.x / 16.0) + sin(coord_01.y / 30.0) - cos(u_time));

  vec3 base = vec3(r,g,b);

/////////// circle

    vec2 coord = gl_FragCoord.xy / u_resolution.xy ;
    coord.x *= u_resolution.x / u_resolution.y;

    vec3 p = vec3(0.5725, 0.1176, 1.0);


// disturb position of circles=> pixel by pixel
    vec2 wavedPos = vec2(
    coord.x + sin(coord.y * 30.0)*sin(u_time) * 0.1,
    coord.y + sin(coord.x * 30.0) * 0.1
    );

// deraw stroke circle

    float c = strokeCircle(wavedPos,0.25,0.02);
    //vec3 waveC = vec3(c);
    vec3 waveC = vec3(1.-c);
    
// overlapping two pattern
    vec3 col = mix(base,p,waveC);

//outcome
  gl_FragColor = vec4(col, 1.0);
}