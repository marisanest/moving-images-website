#ifdef GL_ES
precision mediump float;
#endif


uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p){
    p=fract(p*vec2(234.34,435.345));
    p+=dot(p,p+34.23);
    return fract(p.x*p.y);
}

float myShape(vec2 gv){
    return abs(abs(gv.x+gv.y)-.5);
}

void main(void){
    vec2 uv=(2.*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
    vec3 col=vec3(0.);
    uv*=8.;
    vec2 id=floor(uv);
    uv=fract(uv)-.5;
    float n=hash(id);
    if(n<.5){
        uv.x*=-1.;
    };

    float width=.25;
    float d=myShape(uv);

    float mask=d-width;
    mask=smoothstep(.01,-.01,mask);

    col = mix(col, vec3(1.), mask);
    gl_FragColor=vec4(sqrt(col),1.);
}
