#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform sampler2D u_tex0;
uniform float u_time;
uniform vec2 u_resolution;

mat2 rotate2d(float a){
    return mat2(cos(a),-sin(a),sin(a),cos(a));
}

float hash(vec2 p){
    p=fract(p*vec2(234.34,435.345));
    p+=dot(p,p+34.23);
    return fract(p.x*p.y);
}

void main(){
    vec2 st = 2.*gl_FragCoord.xy/u_resolution - 1.;
    st.x*= u_resolution.x/u_resolution.y;
    st *= sin(u_time*0.1*st.x)*1.0+2.0;

    st *= sin(u_time*0.1*st.y)*1.0+2.0;
    st.x += u_time*0.2;
    st = rotate2d(sin(u_time*0.5)*0.1) * st;
    vec2 id = floor(vec2(st.x + u_time*0.9,st.y));
    st = fract(st)-sin(u_time*0.1);
    float n = hash(id);

    vec3 col;
    if(n<0.5){
        col = vec3(1.0-pow(length(mod(st, sin(u_time*0.3)*0.5+0.6)-0.5),1.2));
    }else if(n>0.5){
        col = vec3(1.0-pow(length(mod(st, 1.0)-vec2(sin(u_time*0.4)*0.5+0.5,cos(u_time*0.4)*0.5+0.5)),0.1));
    }

    float bchan = abs(sin(u_time*st.x+8.0))*0.1;
    gl_FragColor = vec4(col.x,col.y+bchan*0.3,col.z+0.1,1.);
}
