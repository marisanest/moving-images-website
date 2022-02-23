#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float rand(float x) {
    return fract(sin(x) * 1000000.0);
}

float circle(vec2 pos, float radius) {
    return length(pos) - radius;
}

float fill(float dist,float size){
return smoothstep(size,size,dist);
}


float mynoise1 (float x) {
    return x * x * (4.0 - 3.0 * x);
}


float mynoise2 (float x1, float x2) {
 
    return x2 * x2 * length((5.0 * x2 - 4.0 * x2)) * cos(u_time)+ x1 * x1 * abs(sin(u_time)) * (4.0 - 3.0 * x1);
    return x2 * x2 * length((5.0 * x2 - 4.0 * x2)) + x1 * x1 * (4.0 - 3.0 * x1);
}

void main() {
    vec2 st = (3.0 * gl_FragCoord.xy / u_resolution.xy - 1.);
    vec3 colorA = vec3(1.0, 1.0, 1.0);
    st.x *= 30.0;
    st.y *= 30.0;
    
    float i = floor(st.x);
    float f = fract(st.x);
    float f2 = fract(st.y);

    
    float c = mix(rand(i),rand(i + 1.0), mynoise1(f));
    c = mix(floor(st.y), rand(i + 1.0), mynoise2(f, f2));
    c = mix(rand(i), c, mynoise1(f));
    
    vec3 col = vec3(c);
    gl_FragColor = vec4(col, 1.0);
}