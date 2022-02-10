#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

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

float random2D(float st){
    float rand = fract(sin(st *325.3413) * 623.3234);
    return rand; //0 ~ 1
}

void main(){
vec2 st = 2. * gl_FragCoord.xy / u_resolution.xy -1.;
st.x *= u_resolution.x / u_resolution.y;
vec2 mouse = u_mouse/u_resolution.xy;
mouse.x *= u_resolution.x/u_resolution.y;
mouse *= 1000.;
float n = mouse.x;


vec2 newUv = st * n;

st*= 1.;



st.x *= step(1.0, mod(floor(length(st * 4.)), 4.0)) * 4.;
// move to the left
st.x += step(1.0, mod(st.y, 2.0)) * (u_time * random2D(floor(newUv.y)));


//move to the right
st.x += step(mod(st.y, 2.0), 1.0) * (u_time * -random2D(floor(newUv.y)));






//moving light
vec3 color = vec3(length(mod(st, 1.) - vec2(abs(sin(length(st.x) + u_time)))));
// color.x = length(mod(st,0.94) - vec2(cos(0.3),  sin(0.4)));
// color.y = length(mod(st, 1.) - vec2(cos(0.5),  sin(u_time) * 0.3));
// color.z = length(mod(st, 1.) - vec2(cos(0.2),  sin(u_time) * 0.7));




gl_FragColor = vec4(0.03/color, 1.);
}
