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
    //st.x*=u_resolution.x/u_resolution.y; 
    
    vec3 boxColor = vec3(.01, st.x * .1, st.y * .1);
    vec3 color = vec3(1. / st.y * abs(sin(u_time * .5)), st.x * .2, .5);

    vec2 boxPos = st - vec2(.5);
    boxPos = rotate2d(u_time / 3.) * boxPos * 15.;
    boxPos.y += cos(boxPos.x / abs(abs(u_time)) * 9. + u_time) * .1;
    boxPos.x += tan(boxPos.y * 3. - 3. * u_time) * .3;

    float b = box(boxPos, vec2(0.5));
    //b = fill(b, 0.0001);
    color = mix(boxColor, color, b);
    
    
    gl_FragColor = vec4 (color, 1.);
    
}