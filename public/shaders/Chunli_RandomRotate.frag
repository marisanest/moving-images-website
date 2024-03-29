#ifdef GL_ES
precision mediump float;
#endif

//glslViewer col-invert-sqaures.frag  ../textures/pink-necked-green-pigeon-big.jpg
#define PI 3.14159265359
#define SPEED.2

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;

// returns a random float value given a vec2
float hash(vec2 p){
    p=fract(p*vec2(234.34,435.345));
    p+=dot(p,p+34.23);
    return fract(p.x*p.y);
}

float myShape(vec2 gv){
    // Try to play with the functions that
    // you know. Try to came up with your own
    // shape.
    // return abs(sin(cos(gv.y)*sin(gv.x) *1.5 + cos(gv.y)*sin(gv.x) *.3));
        return abs(sin(cos(gv.y)+ cos(gv.y)*sin(gv.x) ));
    // return abs(gv.y + gv.x);
    // return abs(abs(gv.x+gv.y)-.5);
    
    //circle
    // return length(gv*1.) - 0.25;
    return length(abs(gv.x+gv.y)) - .3;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}




void main(void){
    vec2 uv=(2.*gl_FragCoord.xy-u_resolution.xy*3.)/u_resolution.y ;
    vec3 col=vec3(0.);
    // 6) Animate
    uv.y -= u_time * 0.3;
    uv*=5.;
    // 2) each cell has now an id
    vec2 id=floor(uv);
    uv=fract(uv);

    // 3) we can use the id to give a random value to each cell.
    float n=hash(id) * (abs(sin(u_time*.9))+1.);
    // float n=hash(id);
    // random between 0 and 1

    // 5) random flip the x direction only if a condition is match
    if(n<.7){
        //  uv *= rotate2d(uv.x*5.);
        uv.x*=-5.;
        uv.y*=-5.;
    };

    // 4) Try to see what happens if you flip the x direction
    // uv.x *= -2.;
    //rotate
     uv = rotate2d(u_time) * uv;
    float width=.25;
    // 1) draw something. Possible something that is not simmetric
    float d=myShape(uv);
    // uv = rotate2d( sin(u_time)*PI ) * uv;
    
    float mask=d-width;
    mask=smoothstep(.01,-.01,mask);

    col = mix(col, vec3(1.), mask);
    gl_FragColor=vec4(sqrt(col),1.);
}
