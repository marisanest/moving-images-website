#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
#define PI 3.14159265359

float hash(vec2 p){
    p=fract(p*vec2(234.34,435.345));
    p+=dot(p,p+34.23);
    return fract(p.x*p.y);
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(){
    vec2 st = 2.0 * gl_FragCoord.xy/u_resolution.xy - 1.0;
    st.x *= u_resolution.x/u_resolution.y * hash(st);
    
    float xDensity = 5.0;
    float xSpeed = 20.0;
    float gate = sin(u_time);
    
    if (gate < 0.2){
        xDensity = 150.0;
        xSpeed = 2.0;
    }else if (gate >0.5){
        xDensity = 50.0;
        xSpeed = 10.0;
    }

    st.x *= xDensity;
    st.y *= xDensity/10.;
    
    if(st.y >= 0.0){
            st.x += u_time*xSpeed;
        }else if(st.y <= 0.0){
            st.x -= u_time*xSpeed;
        } 
    
    vec2 ipos = floor(st);

    float color = random(ipos);
    
    if(color < 0.2){
        color = 0.0;
    }else{
        color = 1.0;
    }

    gl_FragColor = vec4(vec3(color), 1.0);
}