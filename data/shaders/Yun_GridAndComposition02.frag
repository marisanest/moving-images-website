#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


float box(vec2 p,vec2 b ){
vec2 d = abs(p)-b;
return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float fill(float dist, float size){
return smoothstep(-size, +size, dist);
}

float circle(vec2 pos, float radius) {
    return length(pos) - radius;
}

mat2 rotate2d(float _angle){
return mat2(cos(_angle),-sin(_angle),
sin(_angle),cos(_angle));
}

mat2 scale(vec2 _scale){
return mat2(_scale.x,0.0,
0.0,_scale.y);
}

void main(){
vec2 st = gl_FragCoord.xy / u_resolution.xy;

st.y *= 2.;
if (st.y < 1.) {
    
    st.x *= 4.;
    st.y *= 15.;
    st.x += step(1.0, mod(st.y, 2.0 + 2.0 * sin(u_time / 2.0))) * 0.5;
    st.x += step(1.0, mod(st.x, 5.0)) * 0.5 * sin(st.y);
    st.x += step(1.0, mod(st.x, 2.0 * abs(sin(u_time / 3.0)))) * 0.5;
    st.y += step(1.0, mod(st.y, 2.0 * abs(sin(u_time / 2.5)))) * 0.5;
};

st.y *= 100.;
st = fract(st);

vec3 color = vec3(st, 0.);
vec3 boxColor = vec3(1.0);

float size_1 = 0.1;
float size_2 = 0.12;
vec2 boxPos = st - vec2(1.0 - size_1);
vec2 circlePos = st - vec2(.5 - size_2);
boxPos *= 10. ;
vec2 old_BoxPos = boxPos;
boxPos = fract(boxPos);
boxPos.x += step(1.0, mod(boxPos.x, 5.0)) * 0.5 * sin(boxPos.y);
boxPos.x += step(1.0, mod(old_BoxPos.x, 2.0 * abs(sin(u_time / 2.0)))) * 0.5;
boxPos.y += step(1.0, mod(old_BoxPos.y, 2.0 * abs(sin(u_time / 2.5)))) * 0.5;
boxPos = fract(boxPos);
float b = box(boxPos, vec2(size_1));
b = fill(b, .1);
color = mix(boxColor, color, b);

float c = circle(circlePos, size_2);
c = fill(c, .0001);
gl_FragColor = vec4(color, 1.);
}