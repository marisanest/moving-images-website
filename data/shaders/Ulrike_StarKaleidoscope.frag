#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float rand(float x){
  return fract(sin(x)*100000.);
}

float star(vec2 p,float r){
  const vec4 k=vec4(-.5,.8660254038,.5773502692,1.7320508076);
  p=abs(p);
  p-=2.*min(dot(k.xy,p),0.)*k.xy;
  p-=2.*min(dot(k.yx,p),0.)*k.yx;
  p-=vec2(clamp(p.x,r*k.z,r*k.w),r);
  return length(p)*sign(p.y);
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
  sin(_angle),cos(_angle));
}

void main(){
  
  vec2 st=gl_FragCoord.xy/u_resolution;
  st.x*=u_resolution.x/u_resolution.y;
  
  st*=60.;
  
  vec2 starPos=st-vec2(30.);
  
  float i=floor(star(starPos,8.));
  float f=fract(star(rotate2d(abs(u_time*.3)*-PI)*st,.9));
  float c=rand(i);
  float u=f*f*(5.-2.*f);
  c=mix(rand(i),rand(i+1.),u);
  
  gl_FragColor=vec4(vec3(vec3(fract(c),(c)*sin(u_time),fract(c))),1.);
}

