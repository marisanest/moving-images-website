#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate(float _angle){
return mat2(cos(_angle),-sin(_angle),
sin(_angle),cos(_angle));
}

void main(){

vec2 st = gl_FragCoord.xy / u_resolution.xy *2.-1.;

  st = rotate (u_time*0.4)*st;
  st *= 8.;
  st.x *=  st.y * abs(sin(u_time*0.01));  
  st.x += mod(sin(u_time),2.) * 0.5;
  st = fract (st);

vec4 color = vec4(st.x, 0.0, sin(u_time*0.04), 1.0);
gl_FragColor = color;
}