#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#include "./libs/2dshapes.glsl"
#include "./libs/boolean-ops.glsl"

float fill(float dist, float size){
  return smoothstep(-size, +size, dist);
}

float stroke(float x, float size, float t) {
    float a = smoothstep(-size, +size, x+t *0.5);
    float b = smoothstep(-size, +size, x-t *0.5);
    return a - b;
}

void main(){
    
    vec2 coord = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
    coord.x *= u_resolution.x / u_resolution.y;

    //
    vec4 colorA = vec4(coord.x, coord.y, 0.5, 1.0);
    vec4 colorB = vec4(0.0, 0.0, 0.0, 1.0);

    // FIXED CIRCLE 
    float circleB = circle(coord + vec2(0.0, 0.0), 0.5);
    circleB = fill(circleB, 0.5);
    
    // HORIZONTAL CIRCLE
    float circleA = circle(coord - vec2(sin(u_time) * 0.4, 0.0), abs(sin(u_time)));
    circleA = fill(circleA, 0.3);
    
    // VERTICAL CIRLCE 
    float circleD = circle(coord - vec2(0.0, sin(u_time) * 0.5), abs(sin(u_time)));
    circleD = fill(circleD, 0.9);

    // ROTATING CIRCLE
    float circleC = circle(coord - vec2(sin(u_time) * 0.3,cos(u_time) * 0.2), abs(sin(u_time)));
    circleC = fill(circleC, 0.1);

    float twoCircles = intersect(circleA, circleB);
    float threeCircles = intersect(twoCircles, circleC);
    float fourCircles = intersect(threeCircles, circleD);

    vec4 color = mix(colorA, colorB, fourCircles);

    gl_FragColor=color;
}
