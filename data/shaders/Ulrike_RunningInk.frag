#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float rand(float x){
  return fract(sin(x)*100000.);
}

void main(){
  
  vec2 st=gl_FragCoord.xy/u_resolution.xy;
  st*=15.;
  
  float i=floor(st.x);
  float f=fract(st.x);
  float c=rand(i);
  c=rand(f);
  float u=f*f*(3.-2.*f);
  c=mix(rand(i),rand(i+1.),u);
  
  float d=0.;
  d=length(sqrt(st)+c)+(u_time)*.05;
  
  vec3 bgCol=vec3(.3961,.902,.102);
  vec3 col=vec3(.2039,0.,.949)*st.y;
  col+=bgCol*vec3(smoothstep(10.,5.,st.x+st.y));
  
  gl_FragColor=vec4(vec3(fract(d*2.)*vec3(col)),1.);
}
