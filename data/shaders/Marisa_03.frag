#ifdef GL_ES
precision mediump float;
#endif

#define MAX_RADIUS 0.06
#define BOX_RADIUS 0.06
#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float stroke(float distribution, float outerRange, float innerRange, float thikness) {
    float inner = smoothstep(-innerRange, innerRange, distribution + thikness / 2.);
    float outer = smoothstep(-outerRange, outerRange, distribution - thikness / 2.);
    return inner - outer;
}

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

float merge(float d1, float d2){
	return min(d1, d2);
}

float calculateRadiusDefault() {
    return 0.1;
}

float calculateRadiusV1(int xI, int yI) {
    return MAX_RADIUS * adjustedCos(u_time + PI * float(xI) + float(yI), 1.0, 0.0, 2.0);
}

float calculateRadiusV2() {
    return adjustedCos(u_time, 1., 0.0, .1);
}

float calculateRadiusV3(int xI, int yI) {
    return MAX_RADIUS * adjustedCos(u_time + PI * float(xI) + float(yI), 1.0, 0.0, 2.0);
}

float calculateRadius(int radiusV, int xI, int yI) {
    if (radiusV == 1) {
        return calculateRadiusV1(xI, yI);
    } else if (radiusV == 2){
        return calculateRadiusV2();
    } else if (radiusV == 3){
        return calculateRadiusV3(xI, yI);
    } else {
        return calculateRadiusDefault();
    }
}

vec2 calculateCoordV1(vec2 coord, int xI, int yI, vec2 margin) {
    return vec2(coord.x - margin.x - float(xI) * 2. * BOX_RADIUS, coord.y - margin.y - float(yI) * 2. * BOX_RADIUS);
}

vec2 calculateCoordDefault(vec2 coord) {
    return coord;
}

vec2 calculateCoord(int coordV, vec2 coord, int xI, int yI, vec2 margin) {
    if (coordV == 1) {
        return calculateCoordV1(coord, xI, yI, margin);
    } else {
        return calculateCoordDefault(coord);
    }
}

float drawCircles(vec2 coord, vec2 nCircles, vec2 margin, int radiusV, int coordV) {
    float currentCircle;
    float mergedCircles;
    float percentage;
    float radius;

    for (int xI = 0; xI >= -1; ++xI) {
        for (int yI = 0; yI >= -1; ++yI) {
            currentCircle = circle(
                calculateCoord(coordV, coord, xI, yI, margin),
                calculateRadius(radiusV, xI, yI)
            );

            if (xI == 0 && yI == 0) {
                mergedCircles = currentCircle;
            } else {
                mergedCircles = merge(mergedCircles, currentCircle);
            }
            if (yI + 1 >= int(nCircles.y)) {
                break;
            }
        }
        if (xI + 1 >= int(nCircles.x)) {
            break;
        }
    }

    return mergedCircles;
}

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