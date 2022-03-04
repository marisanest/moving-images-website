#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float rand(float x){
  return fract(sin(x)*100000.);
}

float rand(vec2 st){
  return fract(abs(dot(st.xy,vec2(.4,.3)))*200.);
}

void main(){
  
  vec2 st=gl_FragCoord.xy/u_resolution;
  st.x*=u_resolution.x/u_resolution.y;
  
  st*=12.;
  st*=rand(st);
  st.x+=mod(st.y,5.)+(u_time)*.04;
  st.y+=mod(st.x,.5)*(u_time*.1);
  
  float d=0.;
  d=length(sqrt(st)-9.);
  
  gl_FragColor=vec4(vec3(fract(d*3.)*vec3(.3059,.5216,.9804)),1.);
}
