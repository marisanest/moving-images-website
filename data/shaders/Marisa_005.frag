#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#include "../../libs/local/2dshapes.glsl"
#include "../../libs/local/boolean-ops.glsl"
#include "../../libs/local/colors.glsl"
#include "../../libs/local/coord-ops.glsl"
#include "../../libs/local/style.glsl"
#include "../../libs/local/circle-line.glsl"

float hash(vec2 p){
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

float smileyMouth(vec2 coord) {
    return sdBezier(
        coord, 
        vec2(-.4, -.15), 
        vec2(.0, adjustedCos(u_time, 1.0, -0.65, 0.35)),
        vec2(0.4, -.15)
    );
}

float smileyEye(vec2 coord) {
    return sdBezier(
        coord, 
        vec2(0., .05), 
        vec2(0., .05), 
        vec2(0., -.05)
    );
}

vec4 smileyMouthTile(vec2 st, vec4 color, vec4 backgroundColor) {
    vec2 fistMouthSt = translateCoord(st, vec2(-.5, 0.0));
    float firstMouth = smileyMouth(fistMouthSt);

    vec2 secondMouthSt = translateCoord(st, vec2(.5, 0.0));
    secondMouthSt = rotateCoord(secondMouthSt, PI);
    float secondMouth = smileyMouth(secondMouthSt);

    float mouths = merge(firstMouth, secondMouth);
    
    mouths = 1. - stroke(mouths, 0.01, 0.2);
    
    vec4 currentColor = mix(color, backgroundColor, mouths);

    return currentColor;
}

vec4 smileyEyeTile(vec2 st, vec4 color, vec4 backgroundColor) {
    vec2 firstEyeSt = translateCoord(st, vec2(adjustedCos(u_time, 1.0, -.5, -.2) + 0.2, 0.0));
    float firstEye = smileyEye(firstEyeSt);

    vec2 secondEyeSt = translateCoord(st, vec2(adjustedCos(u_time, 1.0, .2, .5) - 0.2, 0.0));
    float secondEye = smileyEye(secondEyeSt);
    
    float eyes = merge(firstEye, secondEye);
    eyes = 1. - stroke(eyes, 0.01, 0.2);
    
    vec4 currentColor = mix(color, backgroundColor, eyes);

    return currentColor;
}

void main(void){
    vec2 st = setupCoord(gl_FragCoord.xy, u_resolution.xy);
    st = scaleCoord(st, vec2(6.));
    
    vec2 id = floor(st);    
    st = fract(st);

    vec2 tileSt = st;
    tileSt = st;
    
    tileSt = translateCoord(tileSt, vec2(-.5));

    float rand = hash(id); // random between 0 and 1
   
    if(rand < .25){
        tileSt.x *= -1.0;
    } else if (rand < .5) {
        tileSt.y *= -1.0;
    } else if (rand < .75) {
        tileSt.x *= -1.0;
        tileSt.y *= -1.0;
    };

    vec4 currentColor;

    if(rand < .25){
        currentColor = smileyMouthTile(tileSt, WHITE, BLACK);
    } else if (rand < .5) {
        currentColor = smileyEyeTile(tileSt, WHITE, BLACK);
    } else if (rand < .75) {
        currentColor = smileyMouthTile(tileSt, WHITE, BLACK);
    } else {
        currentColor = smileyMouthTile(tileSt, WHITE, BLACK);
    };

    gl_FragColor=currentColor;
}