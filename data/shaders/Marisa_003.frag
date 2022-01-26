#ifdef GL_ES
precision mediump float;
#endif

// good combies: (0.0 - 0.09, 0.1 - 0.2)
#define MAX_RADIUS 0.06
#define BOX_RADIUS 0.06

uniform vec2 u_resolution;
uniform float u_time;

#include "../../libs/local/loops.glsl"
#include "../../libs/local/style.glsl"

void main() {
    vec2 ratio = vec2(u_resolution.x / u_resolution.y, u_resolution.y / u_resolution.x);

    vec2 coord = gl_FragCoord.xy / u_resolution.xy;
    coord.x -= (ratio.y * BOX_RADIUS);
    coord.x *= ratio.x;
    coord.y -= BOX_RADIUS;
    
    vec2 nCircles = vec2(floor(ratio.x / (BOX_RADIUS * 2.)), floor(1.0 / (BOX_RADIUS * 2.)));
    vec2 margin = vec2((ratio.x - nCircles.x * 2. * BOX_RADIUS) / 2., (1.0 - nCircles.y * 2. * BOX_RADIUS) / 2.);

    vec4 colorA = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 colorB = vec4(0.5176, 0.0, 1.0, 1.0);
    vec4 colorC = vec4(0.2353, 1.0, 0.0, 1.0);
    vec4 colorD = vec4(1.0, 0.5333, 0.0, 1.0);
    vec4 resultColor;
    
    float currentCircle;
    float circles;
    float circleStrokes;

    circles = drawCircles(coord, nCircles, margin, 1, 1);
    circleStrokes = stroke(circles, .002, 0.05, 0.05);
    resultColor = mix(colorA, colorB, circleStrokes);

    coord = gl_FragCoord.xy / u_resolution.xy;
    coord.x *= ratio.x;

    currentCircle = circle(
      vec2(coord.x - ratio.x / 2.0, coord.y - 0.5), 
      0.2
    );
    
    circleStrokes = stroke(
        currentCircle, 
        adjustedSin(u_time + PI, 1., 0.005, 0.08),  
        adjustedCos(u_time + PI, 1., 0.005, 0.08), 
        0.03
    );

    resultColor = mix(resultColor, colorC, circleStrokes);

    currentCircle = circle(
        vec2(coord.x - ratio.x / 2.0, coord.y - 0.5), 
        adjustedSin(u_time, 1., 0.0, .1)
    );
    
    circleStrokes = stroke(
        currentCircle,
        adjustedSin(u_time, 1., 0.005, 0.03),  
        adjustedCos(u_time, 1., 0.005, 0.03), 
        0.02
    );

    resultColor = mix(resultColor, colorD, circleStrokes);

    coord = gl_FragCoord.xx / u_resolution.xx; // exchange with gl_FragCoord.xx
    coord.x *= ratio.x;

    currentCircle = circle(
        vec2(coord.x - ratio.x / 2.0, coord.y - 0.5), 
        0.2
    );
    
    circleStrokes = stroke(
        currentCircle, 
        adjustedSin(u_time + PI, 1., 0.005, 0.08),  
        adjustedCos(u_time + PI, 1., 0.005, 0.08), 
        0.04
    );

    resultColor = mix(resultColor, colorC, circleStrokes);

    gl_FragColor=resultColor;
}