#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float B (vec2 p,vec2 b){
vec2 d=abs(p)-b;
return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float B2 (vec2 p,vec2 b){
vec2 d=abs(p)-b;
return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float circle (vec2 pos, float r){
return length(pos) - r;
}


float fill(float dist,float size){
return smoothstep(-size,size,dist);
}

mat2 rotate2d (float a){
return mat2(cos(a),-sin(a),sin(a),cos(a));
}

mat2 scale (vec2 s){
return mat2 (s.x, 0.0, 0.0, s.y);
}

void main(){

vec4 red =vec4(1.0, 1.0, 1.0, 1.0);
vec4 green =vec4(1.0, 0.0, 0.0, 1.0);
vec4 blue =vec4(0.0, 0.2824, 1.0, 1.0);
vec4 yallow =vec4(0.0, 0.902, 0.0314, 1.0);
vec4 pink =vec4(0.7843, 0.0, 1.0, 1.0);

//
vec2 st = 2. * gl_FragCoord.xy/u_resolution.xy- 1.0;
st.y *= u_resolution.y/u_resolution.x;

//
st /= fract(st * 15.);
st *= clamp (st,sin(u_time),sin(u_time));

//
st = scale (vec2(sin(u_time)*1.3)) * st;
float pct = B (st,vec2(.15,0.15));
pct = fill(pct,0.05);
pct /= fract(pct * 1.01);

vec4 color = mix (pink,red, pct);

//
st = scale (vec2(2.)) * st;
float pct0 = B2 (st,vec2(5.,.5));
pct0 = fill(pct0,sin(u_time)*5.);

color = mix (color,green,pct0);

//
st = scale (vec2(0.3)) * st;
float pct2 = circle(st,0.);
pct2 = fill(pct2,.1);
pct2= floor (pct);
pct2 /= clamp (pct2,sin(u_time),sin(u_time));

color = mix (color,green*pct0, pct2);







gl_FragColor = color;
}