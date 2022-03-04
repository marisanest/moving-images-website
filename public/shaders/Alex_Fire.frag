#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

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
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    st.x*=u_resolution.x/u_resolution.y; 
    
    st *= 1.;
    st = fract(st);
    

    vec3 boxColor = vec3(1., st.x / 1., st.y *.1);
    vec3 color = vec3(1. + -st.y * abs(cos(u_time * 1.9)), st.x * .1, .1);

    vec2 boxPos = st - vec2(.5);
    boxPos = rotate2d(sin(u_time * 2.)) * st.x * boxPos;
    boxPos.y += cos(boxPos.x * 9. + sin(u_time*.1)) * .1;
    boxPos.x += tan(boxPos.y * 3. - 3. * cos(u_time)) * .3;

    float b = box(boxPos, vec2(0.4));
    b = fill(b, 0.6 - abs(sin(u_time) / 4.));
    color = mix(boxColor, color, b);
    
    
    gl_FragColor = vec4 (color, 1.);
    
}