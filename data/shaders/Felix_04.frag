#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float intersect(float d1, float d2){
	return max(d1, d2);
}

float fill(float dist, float size){
  return smoothstep(-size, +size, dist);
}

float myCircle(vec2 pos, float radius){
    return length(pos) -radius;
}

void main(){
    vec2 coord = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
    coord.x *= u_resolution.x / u_resolution.y;

    coord*=12.;
    coord=fract(coord);
    coord = coord - vec2(0.5);

    vec4 color0 = vec4(0.0627, 0.0314, 0.3451, 1.0);
    vec4 color1 = vec4(1.0, 1.0, 1.0, 1.0);

    float circle0 = myCircle(coord, abs(sin(u_time)));
    circle0 = fill(circle0, sin(u_time));

    float circle1 = myCircle(coord - vec2(sin(u_time) * 0.5,cos(u_time) * 0.5), 0.5);
    circle1 = fill(circle1, cos(u_time));

    float twoCircles = intersect(circle0, circle1);
 
    vec4 color = mix(color0, color1, twoCircles);
    gl_FragColor=color;
    
}