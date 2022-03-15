#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform sampler2D u_tex0; // /textures/tree2j3.jpg
uniform float u_time;
uniform vec2 u_resolution;
float circle(vec2 uv, float radius){
    return length(uv) - radius;
}
mat2 rotate2d(float a){
    return mat2(cos(a),-sin(a),sin(a),cos(a));
}
float hash(vec2 p){
    p=fract(p*vec2(234.34,435.345));
    p+=dot(p,p+34.23);
    return fract(p.x*p.y);
}
float stroke(float dist, float size, float thickness){
    float a = smoothstep(-size,size,dist + thickness);
    float b = smoothstep(-size,size,dist - thickness);
    return a - b;
}
void main(){
    vec2 st = 2.0*gl_FragCoord.xy/u_resolution.xy-1.0;
    st.x *= u_resolution.x/u_resolution.y;

    st *= abs(sin(u_time*0.1))*9.0*hash(st);
    st.x = st.x* sin(u_time*0.1) * cos(u_time*0.2);
    st.x *= mod(sin(u_time+st.x * 2.),8.0);
    st = rotate2d(mod(sin(u_time),4.0)*0.2) * st;
    
    float rchan = sin(u_time*st.x+8.0)*0.6;
    float gchan = sin(u_time*st.y)*0.2;
    vec4 color = vec4(st.x+0.5, st.x-0.3, 0.258, 1.0);
    vec4 colorA = vec4(0.898, st.y+0.6, st.x, 1.0);

    vec4 texel = texture2D(u_tex0, st).rgba;

    st = 2.0*gl_FragCoord.xy/u_resolution.xy-1.0;
    st.x *= u_resolution.x/u_resolution.y;
    float circleA = circle(st-vec2(sin(u_time)*0.32,cos(u_time)*0.3),sin(u_time*0.1)*0.02+0.01);
    float circleB = circle(st,sin(u_time*0.1)*0.02+0.01);
    circleB = stroke(circleB,0.1,0.2);    
    texel = mix(texel,color,circleB);
    texel = mix(colorA,texel,circleA);
    gl_FragColor = vec4(texel);
}

