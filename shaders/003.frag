#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main(){
  
  vec2 st=3.*gl_FragCoord.xy/u_resolution.xy;
  
  float d=0.;
  d=length(sin(st)-.4);

//uncomment the following lines and try different patterns
  // d = length(atan(st)-.9);
  // d = length(tan(st)-.9);
  // d = length(degrees(st)-.9);
  // d = length(pow(st, st)-.9);
  // d = length(floor(st)-.1);
  // d = length(sqrt(st)-.1);
  // d = length(log(st)-.1);
  // d = length(exp(st)-.1);
  
  gl_FragColor=vec4(vec3(fract(d*20.)*vec3(.6745,.6667,1.)),1.);
}
