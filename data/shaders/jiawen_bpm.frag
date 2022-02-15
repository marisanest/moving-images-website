#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
uniform float u_time;
uniform vec2 u_resolution;

float box(vec2 p,vec2 b){
    vec2 d=abs(p)-b;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
}

float circle(vec2 uv, float radius){
    return length(uv) - radius;
}

float fill(float dist,float size){
    return smoothstep(size,size,dist);
}

mat2 rotate2d(float a){
    return mat2(cos(a),-sin(sin(a)),sin(sin(a+sin(a*0.2))),cos(a*sin(a*0.3+sin(a*0.01))));
}

mat2 scale(vec2 s){
    return mat2(s.x, 0.0, 0.0, s.y);
}

float stroke(float dist, float size, float thickness){
    float a = smoothstep(-size,size,dist + thickness);
    float b = smoothstep(-size,size,dist - thickness);
    return a - b;
}

void main(){
    float time = u_time*(72.0/60.0);
    vec2 st=2.*gl_FragCoord.xy/u_resolution.xy-1.;
    st.x*=u_resolution.x/u_resolution.y;

    vec4 colorRed = vec4(sin(cos(time)+time),cos(sin(time+4.0)),0.0,sin(sin(time) + cos(time*20.0)));
    vec4 colorGreen = vec4(1.0, sin(sin(time)+time*0.1), 0.0314, 1.0);
    vec4 colorBlue = vec4(0.0,1.0 + sin(time/2.0 + time),1.0,1.0);

    st = rotate2d(sin(time/40.0)*PI) * st;
    float pct=box(st,vec2(2.25,.25));
    pct=fill(pct,.001);

    st = scale(vec2(sin(time/40.0 + cos(time))*2.+4.0)) * st;
    float circle = circle(st, 1.5);
    circle = stroke(circle, sin(time+sin(time*4.0)), 2.0);

    vec4 color = mix(colorBlue,colorGreen,pct);
    color = mix(colorRed,color,circle);

    gl_FragColor=color;
}