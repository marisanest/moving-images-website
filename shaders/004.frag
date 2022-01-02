#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main(){
  float myTime=mod(u_time,5.);
  myTime=pow(myTime,2.);
  
  vec2 st=gl_FragCoord.xy/u_resolution;
  st.x*=u_resolution.x/u_resolution.y;
  
  st*=12.;
  st.x+=mod(st.y,3.)*sin(myTime)*.06;
  st.y+=mod(st.x,1.)*(myTime*.1);
  st.x+=mod(st.x,1.)*cos(myTime)*.06;
  st.y+=mod(st.y,.5)*(myTime*-.1);
  
  float d=0.;
  d=length(sqrt(st)-.1);

  gl_FragColor=vec4(vec3(fract(d*10.)*vec3(.0039,.902,1.)),1.);
}
