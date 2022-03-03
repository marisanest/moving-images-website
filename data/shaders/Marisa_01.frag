#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLACK vec4(0.0, 0.0, 0.0, 1.0)
#define WHITE vec4(1.0, 1.0, 1.0, 1.0)
#define ORANGE vec4(1.0, 0.5333, 0.0, 1.0)
#define LILA vec4(0.5176, 0.0, 1.0, 1.0)

#define PI 3.1415926535897932384626433832795

float applyMinMax(float value, float minValue, float maxValue) {
    float ratio = (maxValue - minValue) / 2.0;
    value *= ratio;
    value += (minValue + (1. * ratio));
    return value;
}

float applyFrequency(float value, float frequency) {
    return value * frequency;
}

float adjustedSin(float value, float frequency, float minValue, float maxValue) {
    value = applyFrequency(value, frequency);
    value = sin(value);
    value = applyMinMax(value, minValue, maxValue);
    return value;
}

float adjustedCos(float value, float frequency, float minValue, float maxValue) {
    value = applyFrequency(value, frequency);
    value = cos(value);
    value = applyMinMax(value, minValue, maxValue);
    return value;
}

float distanceCircleBorderToOutside(vec2 coord, float radius) {
    return length(coord) - radius;
}

float circle(vec2 coord, float radius) {
    return distanceCircleBorderToOutside(coord, radius);
}

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

vec2 rotateCoord(vec2 coord, float angle) {
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    return rotation * coord;
}

vec2 scaleCoord(vec2 coord, vec2 scalingFactor) {
    mat2 scaling = mat2(scalingFactor.x, 0.0, 0.0, scalingFactor.y);
    return scaling * coord;
}

vec2 translateCoord(vec2 coord, vec2 translationValue) {
    vec2 translation = vec2(translationValue.x, translationValue.y);
    return coord + translation;
}

float stroke(float distribution, float outerRange, float innerRange, float thikness) {
    float inner = smoothstep(-innerRange, innerRange, distribution + thikness / 2.);
    float outer = smoothstep(-outerRange, outerRange, distribution - thikness / 2.);
    return inner - outer;
}

vec4 movingCircle(vec2 st, vec4 color, vec4 colorResult) {
    float circleResult = circle(st, 0.2);
    float strokeResult = stroke(circleResult, .002, 0.05, 0.05);
    colorResult = mix(color, colorResult, 1. - strokeResult);

    return colorResult;
}

vec2 updateCircleLineCoord(vec2 coord, float translationValue) {
    vec2 updatedCoord = scaleCoord(coord, vec2(1., adjustedCos(u_time, 1., 0., 1.)));
    updatedCoord = translateCoord(updatedCoord, vec2(translationValue, 0));
    return updatedCoord;
}

vec4 circleLine(vec2 st, vec4 innerCircleColor, vec4 outerCircleColor, vec4 currentColor, float rotateFactor, float maxBaseScaleFactor) {
    float circleResult;
    float strokeResult;

    vec2 circleBaseSt = st;
    vec2 circleLeftSt = st;
    vec2 circleRightBSt = st;

    float translationValue = adjustedCos(u_time, 1., 0.1, .5);

    circleBaseSt = rotateCoord(circleBaseSt, sin(u_time + rotateFactor * PI));
    circleBaseSt = scaleCoord(circleBaseSt, vec2(1., adjustedCos(u_time, 1.0, 0., maxBaseScaleFactor))); // vec2(1., .0), vec2(1., .5)
    circleLeftSt = circleBaseSt;
    circleRightBSt = circleBaseSt;

    currentColor = movingCircle(circleBaseSt, innerCircleColor, currentColor);

    circleLeftSt = updateCircleLineCoord(circleLeftSt, translationValue);
    currentColor = movingCircle(circleLeftSt, outerCircleColor, currentColor);

    circleRightBSt = updateCircleLineCoord(circleRightBSt, -translationValue);
    currentColor = movingCircle(circleRightBSt, outerCircleColor, currentColor);

    circleLeftSt = updateCircleLineCoord(circleLeftSt, translationValue);
    currentColor = movingCircle(circleLeftSt, outerCircleColor, currentColor);

    circleRightBSt = updateCircleLineCoord(circleRightBSt, -translationValue);
    currentColor = movingCircle(circleRightBSt, outerCircleColor, currentColor);

    return currentColor;
}


void main() {
    vec2 st = setupCoord(gl_FragCoord.xy, u_resolution);
    vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 currentColor = BLACK;

    currentColor = circleLine(scaleCoord(st, vec2(0.2)), BLACK, WHITE, currentColor, 0.5, 0.);
    currentColor = circleLine(rotateCoord(scaleCoord(st, vec2(0.2)), 0.25 * PI), WHITE, BLACK, currentColor, 0.5, 0.0);
    currentColor = circleLine(rotateCoord(st, 0.25 * PI), WHITE, WHITE, currentColor, -1., 0.5);
    currentColor = circleLine(st, LILA, ORANGE, currentColor, 0.0, 0.5);
    currentColor = circleLine(st, ORANGE, LILA, currentColor, 0.5, 0.);
    currentColor = circleLine(scaleCoord(st, vec2(0.2)), BLACK, WHITE, currentColor, 0.5, 0.);
    
    gl_FragColor=currentColor;
}