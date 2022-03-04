#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

float box(vec2 p,vec2 b ){
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float fill(float dist, float size){
  return smoothstep(-size, +size, dist);
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

void main(){
    vec2 st = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
    vec2 st2;
    vec2 st_mini; 
    st.x*=u_resolution.x/u_resolution.y;

    //box moving speed.
    float timedev = .9; 
    float stVar;
    
    //scale
    stVar = sin(u_time*.1) * 5.;
//  stVar = 1.;

    st*=5. * stVar;
    
   
    
    vec2 offset;
    
    offset.x = u_time*timedev ;
    
if (mod(offset.x, 2.0)<1.0){

     if (mod(st.x, 2.0) < 1.0){

         st.y += (u_time) *timedev;
         
     }
     else{
         st.y -= (u_time)*timedev;
     }
    
}
else{

     if (mod(st.y, 2.0) < 1.0){

         st.x += (u_time) *timedev;
     }
     else{
         st.x -= (u_time)*timedev;
     }
}

    //st.x += step(1., mod(st.y,2.0)) * 0.5;
    //st.x += step(1., mod(st.y,2.0)) * 0.5;


     
    st=fract(st);
    float box_devide_par = 1.;
    st_mini = vec2(st-box_devide_par*.5); 
    

    //mini box num par
    st2 = fract(st_mini*(abs(sin(u_time*.8)))*10.-1.);
    
    //mini box zoom par
    // float boxSize1 =.5* abs(cos(u_time));
    float boxSize1 =.51;
    
    float boxSize2 =.4;
    vec3 color=vec3(0., 0., 0.);
    vec3 colorbg =vec3(0.0, 0.0, 0.0);
    vec3 boxColor1 = vec3(1.0, 1.0, 1.0);
    vec3 boxColor2 = vec3(0.0, 0.0, 0.0);
    vec2 boxPos = st - vec2(0.5, 0.5);
    vec2 boxPos2 = st2 - vec2(0.5, 0.5);
    float box1 = fill(box(boxPos, vec2(boxSize1, boxSize1)), 0.001);
    float box2 = fill(box(boxPos2, vec2(boxSize2,boxSize2)), 0.001);
    

    boxColor1 = mix(boxColor1, colorbg, box1);
 
    // boxColor1  = colorbg;
    boxColor2 = mix(boxColor2, boxColor1, box2);
    color = mix(boxColor2, boxColor1, box2);
    gl_FragColor=vec4(color,1.);
}