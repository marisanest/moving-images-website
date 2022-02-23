#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float myCircle(vec2 pos, float radius){
    return length(pos) -radius;
}

float fill(float dist, float size){
  return smoothstep(-size, +size, dist);
}

float merge(float d1, float d2){
	return min(d1, d2);
}

float intersect(float d1, float d2){
	return max(d1, d2);
}

void main(){
    // create coord system in the middle 
    vec2 coord = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
    coord.x *= u_resolution.x / u_resolution.y;
    
    vec2 coord2 = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
    coord2.x *= u_resolution.x / u_resolution.y;

    vec2 coord3 = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
    coord3.x *= u_resolution.x / u_resolution.y;

    vec2 coord4 = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
    coord4.x *= u_resolution.x / u_resolution.y;

    // rotate origin of coord system 
    coord = coord - vec2(sin(u_time) * 0.5,cos(u_time) * 0.1);
    coord2.x += sin(u_time) * 0.2;
    coord3.y += sin(u_time) * 0.3;
    coord4 += sin(u_time) * 0.4;

    // draw cirlce and fill
    float circle = myCircle(coord, sin(u_time));
    circle = fill(circle, cos(u_time));
    
    float circle2 = myCircle(coord2, abs(sin(u_time)));
    circle2 = fill(circle2, sin(u_time));

    float circle3 = myCircle(coord3, abs(cos(u_time)));
    circle3 = fill(circle3, 0.0);
       
    float circle4 = myCircle(coord4, abs(cos(u_time)));
    circle4 = fill(circle4, 0.0);

    float twoCircles = merge(circle, circle2);
    float threeCircles = merge(twoCircles, circle3);
    float fourCircles = merge(threeCircles, circle4);

    // mix the colors 
    vec4 colorA = vec4(coord.x, 1.0, 1.0, 1.0);
    vec4 colorB = vec4(0.0, 0.3176, 1.0, 1.0);
    vec4 color = mix(colorA, colorB, fourCircles);

    gl_FragColor = color;
}