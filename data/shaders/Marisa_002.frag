#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLACK vec4(0.0, 0.0, 0.0, 1.0)
#define WHITE vec4(1.0, 1.0, 1.0, 1.0)

vec2 normalizeCoord(vec2 coord, vec2 monitorResolution) {
    return coord.xy / monitorResolution.xy;
}

vec2 centerCoord(vec2 coord) {
    return 2.0 * coord - 1.0;
}

vec2 fixCoordRatio(vec2 coord, vec2 monitorResolution) {
    coord.x *= monitorResolution.x / monitorResolution.y;
    return coord;
}

vec2 setupCoord(vec2 coord, vec2 monitorResolution) {
    vec2 setupedCoord = coord;
    setupedCoord = normalizeCoord(setupedCoord, monitorResolution);
    setupedCoord = centerCoord(setupedCoord);
    setupedCoord = fixCoordRatio(setupedCoord, monitorResolution);

    return setupedCoord;
}

vec2 scaleCoord(vec2 coord, vec2 scalingFactor) {
    mat2 scaling = mat2(scalingFactor.x, 0.0, 0.0, scalingFactor.y);
    return scaling * coord;
}

vec2 translateCoord(vec2 coord, vec2 translationValue) {
    vec2 translation = vec2(translationValue.x, translationValue.y);
    return coord + translation;
}

float distanceCircleBorderToOutside(vec2 coord, float radius) {
    return length(coord) - radius;
}

float circle(vec2 coord, float radius) {
    return distanceCircleBorderToOutside(coord, radius);
}

float stroke(float distribution, float outerRange, float innerRange, float thikness) {
    float inner = smoothstep(-innerRange, innerRange, distribution + thikness / 2.);
    float outer = smoothstep(-outerRange, outerRange, distribution - thikness / 2.);
    return inner - outer;
}

void main() {
    vec2 coord = setupCoord(gl_FragCoord.xy, u_resolution);

    coord *= .8;

    vec4 backgroundColor = BLACK;

    vec2 circleCoord = coord;
    circleCoord = scaleCoord(circleCoord, vec2(1., sin(u_time * 0.5) * sin(u_time)));
    circleCoord = translateCoord(circleCoord, vec2(0.2, 0.2));

    float circleShape = circle(circleCoord, 0.2);
    float circleStroke = stroke(circleShape, .002, 0.05, 0.05);
    
    backgroundColor = mix(WHITE, backgroundColor, circleStroke);

    circleCoord = coord;
    circleShape = circle(circleCoord, 0.2);
    circleStroke = stroke(circleShape, .002, 0.05, 0.05);
    
    backgroundColor = mix(BLACK, backgroundColor, circleStroke);

    gl_FragColor = backgroundColor;
}