#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
#define PI 3.14159265359

float rand(vec2 st) {
    return fract(sin( dot(st.xy, vec2(1.5 * sin(st.x), -1.5 * sin(st.y) * (sin(u_time))))) * 120. * abs(sin(u_time / 2.)));
}

float rand2(vec2 st) {
    return fract(sin( dot(st.xy, vec2(50.5 * fract(st.x) * u_time / 20., -50.5 * fract(abs(sin(st.y)) * u_time/20.)))) * 2000.);    
}

float circle(vec2 pos, float radius) {
    return length(pos) - radius;
}

float fill(float dist,float size){
return smoothstep(size,size,dist);
}

float merge(float d1, float d2){
    return min(d1, d2);
}

float rand(float x){
    return fract(sin(x) * 100000.0);
} 


void main(){
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    vec4 colorA = vec4(sin(st.x) + sin(u_time), sin(st.x) + 0.5, 1., 1.0);
    vec4 colorB = vec4(1.0, cos(u_time) / 2. + 0.5 , 1., 1.0);
    vec4 colorC = vec4(1.0, sin(st.y) - sin(u_time) , cos(st.x) * sin(st.y) , 1.0);
    

    //noise filters
    float noise_1 = st.x;
    noise_1 = rand(st);
    vec4 color = mix(colorA, colorB, noise_1);
    
    float noise_2 = st.x;
    noise_2 = rand2(st);
    vec4 noiseFilter2 = mix(colorA, colorC, noise_2);

    //circles
    vec2 st_temp = st;
    st_temp = 3. * gl_FragCoord.xy / u_resolution.xy - 1.;
    st_temp.x *= u_resolution.x / u_resolution.y;
    st_temp = fract(vec2(st_temp.x * 2., st_temp.y * abs(cos(u_time/2.5))));
    vec2 st_circle = st_temp - vec2(.5);
    float circle1 = fill(circle(st_circle, 0.8 * abs(cos(u_time/2.5)) + abs(sin(u_time/2.5)) * 0.1), .005);
    color = mix(color, colorC, circle1);

    //circle2
    st = 2. * gl_FragCoord.xy / u_resolution.xy - 1.;
    st.x *= u_resolution.x / u_resolution.y;
    
    vec2 st_circle2 = vec2(st.x + sin(u_time * 1.5) / 1.5, st.y);
    float circle2 = fill(circle(st_circle2, 0.00002), .5);
    color = mix(colorC, color, circle2);
    

    //cicle3
    vec2 st_circle3 = vec2(st.x - sin(u_time * 1.5) / 1.2 , st.y);
    float circle3 = fill(circle(st_circle3, 0.00002), 0.2);
    color = mix(noiseFilter2, color, circle3);
    
    gl_FragColor = vec4(color);

} 
