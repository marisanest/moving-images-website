#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float box(vec2 p,vec2 b ){
vec2 d = abs(p)-b;
return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float fill(float dist, float size){
return smoothstep(-size, +size, dist);
}

mat2 rotate2d(float _angle){
return mat2(cos(_angle),-sin(_angle),
sin(_angle),cos(_angle));
}

mat2 scale(vec2 _scale){
return mat2(_scale.x,0.0,
0.0,_scale.y);
}

float random2D(float st){
    float rand = fract(sin(st *325.3413) * 623.3234);
    return rand; //0 ~ 1
}

float hash(vec2 p){
p=fract(p*vec2(234.34,435.345));
p+=dot(p,p+34.23);
return fract(p.x*p.y);
}

void main(){
vec2 st =  2. * gl_FragCoord.xy / u_resolution.xy - 1.;
st.x *= u_resolution.x / u_resolution.y;

    //mouse
    vec2 mouse = 2. * u_mouse/u_resolution.xy -1.;
    mouse.x *= u_resolution.x/u_resolution.y;

    vec3 bgColor = vec3(0.);
    vec3 colorLayerA = vec3(1.0, 1.0, 1.0);
    vec3 colorLayerB = vec3(1.-(distance(st, mouse) * (0.8)));

    
    st.x += sin(u_time) * 0.5;
    st.y += cos(u_time) * 0.5;
    //Layer A
    vec2 layerA = st ;

    //BG
    layerA *= 2.;
    layerA = sin(-1.8 + sin(u_time)) * layerA * length(st) * 1. + u_time;
    layerA = fract(layerA);
 
    // bgColor = vec3(0.03 + ( abs(sin(u_time) * 0.04))/(length(mod(layerA, 1.) - 0.5 )));
    bgColor.x = 0.03 + ( abs(sin(u_time) * 0.01))/(length(mod(layerA, 1.) - 0.5 ));
    bgColor.y = 0.03 + ( abs(sin(u_time) * 0.04))/(length(mod(layerA, 1.) - 0.5 ));
    bgColor.z = 0.03 + ( abs(sin(u_time) * 0.04))/(length(mod(layerA, 1.) - 0.5 ));

    //stop!
    st.x -= sin(u_time) * 0.5;
    st.y -= cos(u_time) * 0.5;

    //Layer B
    vec2 layerB = st ;
    layerB *= 9.;
    
    
    vec2 size = vec2(0.);

    mouse *= 5.;

    if(distance(layerB, mouse) < 8.){
        size = vec2(distance(layerB, mouse) * 0.01);
    }else{
        size = vec2(0.5);
    }

    layerB = fract(layerB);

    vec2 boxPosB = layerB - vec2(0.5, 0.5);

 
    
    float boxB = fill(box(boxPosB, size), 0.001);

    bgColor = mix(colorLayerB, bgColor, boxB);


    



gl_FragColor = vec4(bgColor, 1.);
}