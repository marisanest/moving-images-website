#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLACK vec4(0.0, 0.0, 0.0, 1.0)
#define WHITE vec4(1.0, 1.0, 1.0, 1.0)
#define ORANGE vec4(1.0, 0.5333, 0.0, 1.0)
#define LILA vec4(0.5176, 0.0, 1.0, 1.0)

#define PI 3.14159265359

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

float dot2(vec2 x) {
    return length(x) * length(x);
}

float merge(float d1, float d2){
	return min(d1, d2);
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

float stroke(float distribution, float range, float thikness) {
    return stroke(distribution, range, range, thikness);
}

float sdBezier(in vec2 pos, in vec2 A, in vec2 B, in vec2 C) {
    vec2 a = B - A;
    vec2 b = A - 2.0*B + C;
    vec2 c = a * 2.0;
    vec2 d = A - pos;
    float kk = 1.0/dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
    float kz = kk * dot(d,a);
    float res = 0.0;
    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx-3.0*ky) + kz;
    float h = q*q + 4.0*p3;
    if( h >= 0.0)
    {
        h = sqrt(h);
        vec2 x = (vec2(h,-h)-q)/2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        float t = clamp( uv.x+uv.y-kx, 0.0, 1.0 );
        res = dot2(d + (c + b*t)*t);
    }
    else
    {
        float z = sqrt(-p);
        float v = acos( q/(p*z*2.0) ) / 3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3  t = clamp(vec3(m+m,-n-m,n-m)*z-kx,0.0,1.0);
        res = min( dot2(d+(c+b*t.x)*t.x),
                   dot2(d+(c+b*t.y)*t.y) );
    }
    return sqrt( res );
}

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