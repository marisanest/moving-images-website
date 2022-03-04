#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float rand(float x){
  return fract(sin(x)*100000.);
}

float rand(vec2 st){
  return fract(sin(dot(st.xy, vec2(0.4, 70)))* 100.);
    }
    
    void main(){
      
      vec2 st=3.*gl_FragCoord.xy/u_resolution.xy;
      
      float d=0.;
      d=length(sin(st)-.4);
      d=length(sin(st)-rand(st)*.01+abs(u_time)*.015);
      
      gl_FragColor=vec4(vec3(fract(d*100.)*vec3(rand(st.xy)*2.,rand(st.y)*2.,rand(st.x)*2.5)),1.);
    }
    