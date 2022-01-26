#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#include "../../libs/local/2dshapes.glsl"
#include "../../libs/local/boolean-ops.glsl"
#include "../../libs/local/coord-ops.glsl"
#include "../../libs/local/style.glsl"
#include "../../libs/local/colors.glsl"

void main() {
    vec2 coord = setupCoord(gl_FragCoord.xy, u_resolution);

    //coord *= 2.0;
    coord *= .8;
    //coord = fract(coord);
    //coord -= 0.5;
    //coord *= coord;
    
    vec4 backgroundColor = BLACK;

    vec2 circleCoord = coord;
    circleCoord = scaleCoord(circleCoord, vec2(1., sin(u_time * 0.5) * sin(u_time)));
    circleCoord = translateCoord(circleCoord, vec2(0.2, 0.2));
    //circleCoord = translateCoord(circleCoord, vec2(adjustedSin(u_time, 1.0, -0.25, 0.2), adjustedCos(u_time, 1.0, -0.2, 0.2)));

    float circleShape = circle(circleCoord, 0.2);
    float circleStroke = stroke(circleShape, .002, 0.05, 0.05);
    
    backgroundColor = mix(WHITE, backgroundColor, circleStroke);

    circleCoord = coord;
    circleShape = circle(circleCoord, 0.2);
    circleStroke = stroke(circleShape, .002, 0.05, 0.05);
    
    backgroundColor = mix(BLACK, backgroundColor, circleStroke);

    gl_FragColor = backgroundColor;
}