#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float circle(vec2 coord, float radius){
    return length(coord) - radius;
}

float star(vec2 p, float r ){
    const vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
    p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
    return length(p)*sign(p.y);
}

float fill(float dist, float size){
  return smoothstep(size, size, dist);
}



void main(){
    vec3 red=vec3(.6,.0392,.0392);
    vec3 green=vec3(.0039,.2235,.0039);
    vec3 yellow=vec3(1.,.7686,0.);
    vec3 lightgreen=vec3(.2745,.4667,.302);
    
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    st.x*=u_resolution.x/u_resolution.y;
    
    vec2 st_layer=st;
    
// mini green stars
    st*=15.0;
    st.x+=step(1.0,mod(st.y,2.))*0.5;
    st=fract(st);
    
    vec2 rotate1=st+vec2(cos(u_time),sin(u_time));
    st+=rotate1*0.1;
    vec2 stripedPos=st-vec2(0.8);
    float str=fill(star(stripedPos,0.1),0.0005);
    vec3 color=mix(lightgreen,green,str);
    
//red circle
    st_layer*=5.0;
    st_layer.x+=step(1.0,mod(st_layer.y,2.))*0.5;
    st_layer=fract(st_layer);
    
    vec2 rotate2=vec2(cos(u_time),sin(u_time));
    st_layer+=rotate2*0.06;
    vec2 circlePos=st_layer-vec2(.5);
    float c=fill(circle(circlePos,.2),.1);
    color=mix(red,color,c);
    
// yellow stars
    vec2 starPos=st_layer-vec2(0.5);
    float s=fill(star(starPos,0.1),0.001);
    color=mix(yellow,color,s);
    
    gl_FragColor=vec4(color,1.0);
}