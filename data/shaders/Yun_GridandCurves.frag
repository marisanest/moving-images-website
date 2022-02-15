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
st.x *= u_resolution.x / u_resolution.y;

st *= 5.0;

if (mod(st.y, 2.) < 1.0 ) {
    st.x += 0.5;
};

vec2 old_st = st;

st.x += sin(st.y);
st.y += sin(old_st.x);
st.x = fract(old_st.x / 0.6);
st.y = fract(abs(st.y * abs(sin(u_time/ 10.0))));

vec3 color = vec3(st.x, .8 , sin(st.y) + 0.2);
vec3 boxColor = vec3(1., .8, st.x);

vec2 boxPos = st - vec2(.5);
boxPos = scale(vec2(sin(u_time/ 2.0) * 0.9)) * st;
float b1 = box(boxPos, vec2(0.2));
b1 = fill(b1, .1);
color = mix(boxColor, color, b1);

old_st = fract(old_st);
boxPos = old_st - vec2(.7);
float b2 = box(boxPos, vec2(.02));
b2 = fill(b2, .001);
color = mix(boxColor, color, b2);

gl_FragColor = vec4(color, 1.);

}
