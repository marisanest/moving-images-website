#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#include "../../libs/local/2dshapes.glsl"
#include "../../libs/local/colors.glsl"
#include "../../libs/local/boolean-ops.glsl"
#include "../../libs/local/coord-ops.glsl"
#include "../../libs/local/style.glsl"
#include "../../libs/local/smiley.glsl"
#include "../../libs/local/circle-line.glsl"

void main() {
    vec2 st = setupCoord(gl_FragCoord.xy, u_resolution);
    vec4 currentColor = BLACK;

    vec2 lineSt = st;
    //lineSt *= 0.5;

    vec4 C1 = ORANGE; //vec4(0.9843, 0.2824, 0.2824, 1.0);
    vec4 C2 = LILA; //vec4(0.7137, 0.4196, 0.9137, 1.0); //vec4(0.7137, 0.4196, 0.9137, 1.0)

    currentColor = circleLine(rotateCoord(lineSt, .75 * PI), WHITE, C1, currentColor, 0.0, .0);
    currentColor = circleLine(lineSt, WHITE, C2, currentColor, 0.0, 0.0);
    currentColor = circleLine(lineSt, WHITE, C2, currentColor, 1.0, 1.0);

    bool window = !(mod(u_time, 2. * PI) < PI);
    //window = true;
    currentColor = smiley(st, WHITE, currentColor, false);

    gl_FragColor=currentColor;
}