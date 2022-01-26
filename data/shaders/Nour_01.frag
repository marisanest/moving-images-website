#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float box(vec2 p,vec2 b){
    vec2 d =abs(p)-b;
    return length(max(d,0.0))+min(max(d.x,d.y),0.);
}

float fill(float dist,float size){
    return smoothstep(-size,+size,dist);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.,
    0.,_scale.y);
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution ;
    st.x*=u_resolution.x/u_resolution.y;

    
    vec3 colorLayerA =vec3(pow(sin(u_time)*1.,0.9), 0.3, 0.5);
    vec3 colorBg     =vec3(1.0, 1.0, 1.0);
    vec3 colorLayerB =vec3(0.2, 0.2, pow(sin(u_time)*1.,0.6));
    vec3 colorLayerC =vec3(1., pow(cos(u_time)*1.,0.6), 0.6627);

    
    vec2 layerA = st;
    layerA*=9.;
    layerA=fract(layerA);
    layerA = rotate2d(sin(u_time)*0.07)*layerA;
    layerA -=scale(vec2(cos(u_time))*0.025)*layerA;
    layerA += sin(u_time)*0.02*cos(u_time);

    vec2 boxPosA = layerA - vec2(0.5,0.5); 
    float boxA = fill (box(boxPosA,vec2(.3)),.04);
    colorBg = mix(colorLayerA,colorBg,boxA);
    

    vec2 layerB=st;
    layerB*=5.;
    layerB=fract(layerB);
    layerB = rotate2d(sin(u_time)*0.1)*layerB;
    layerB += sin(u_time)*0.04;
    layerB +=scale(vec2(cos(u_time))*0.02)*layerB;
    vec2 boxPosB = layerB - vec2(.5,0.5);
    float boxB = fill (box ( boxPosB,vec2 (.3)),.001);
    colorBg=mix(colorLayerB,colorBg,boxB);
    
    vec2 layerC=st;
    layerC*=5.;
    layerC=fract(layerC);
    layerC = rotate2d(sin(u_time)*0.1)*layerC;
    layerC += sin(u_time)*0.04;
    layerC+=scale(vec2(cos(u_time))*0.02)*layerC;
    vec2 boxPosC = layerC - vec2(.5,0.5);
    float boxC = fill (box (boxPosC,vec2 (.26)),.001);
    colorBg=mix(colorLayerC,colorBg,boxC);

gl_FragColor=vec4(colorBg,1.);
}