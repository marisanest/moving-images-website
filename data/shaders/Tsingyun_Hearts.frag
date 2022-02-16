
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define S(a,b,t) smoothstep(a,b,t)
#define sat(x) clamp(x, 0., 1.)
#define MOD3 vec3(.1031,.11369,.13787)
#define saturate(x) clamp(x,0.,1.)

const int nParticles = 150;
const float size = 0.001;
const float softness = 150.0;
const vec4 bgColor = vec4(0.0,0.0,0.0,1.0);
float intensity = 1.3;
float radius = 0.015;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float random (int i){
 return fract(sin(float(i)*43.0)*4790.234);   
}

float softEdge(float edge, float amt){
    return clamp(1.0 / (clamp(edge, 1.0/amt, 1.0)*amt), 0.,1.);
}

// Polynomial smooth max from IQ
float smax( float a, float b, float k ) {
	float h = sat( .5 + .5*(b-a)/k );
	return mix( a, b, h ) + k*h*(1.-h);
}

float Heart( vec2 uv, float b) {
 
    float r = .25;
    b *=r;
	uv.x*=.7;
    uv.y -= smax(sqrt(abs(uv.x))*.5, b, .1);
    uv.y += .1+b*.5;
    
    float d = length(uv);
    return S(r+b, r-b, d);
}

vec2 tile(vec2 st, float zoom){
    st *= zoom;
    return fract(st);
}

//  1 out, 1 in...
float hash11(float p) {
    // From Dave Hoskins
	vec3 p3  = fract(vec3(p) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

//  1 out, 2 in...
float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


void main(){
    vec2 uv,uv01 =  2.*gl_FragCoord.xy / u_resolution.xy-1. ;
    
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    uv=abs(uv);
    uv = scale( vec2(sin(u_time)+1.0) ) * uv;
    float circle = length(uv01);
    float u_time01,u_time02=u_time;

    vec4 col = vec4(.0);
    uv+=uv01/circle
        *(sin(u_time02)+1.)
		*abs(sin(circle*7.-(u_time02)*2.));
    uv =vec2(.01/length(fract(uv)-.5));

    vec3 c;
    for(int i = 0; i<3; i++){
        c[i]=.01/length(fract(uv01)-.5);

    }
    
    float np = float(nParticles);
    vec4 particlesBg = vec4(0.);
    for(int i = 0; i< nParticles; i++){
        
        vec2 tc = uv;
        
        float r = random(i);
        float r2 = random(i+nParticles);
        float r3 = random(i+nParticles*2);
 
        tc.x -= sin(u_time*1.125 + r*30.0)*r;
        tc.y -= cos(u_time*1.125 + r*40.0)*r2*0.5;
                    
        float l = length(tc - vec2(aspect*0.5, 0.5));// - r*size;
        tc -= vec2(aspect*0.5, 0.5)*1.0;
        tc = tc * 2.0 - 1.0;
        tc *= 1.0;
        tc = tc * 0.5 + 0.5;
        
        vec4 orb = vec4(r, r2, r3, softEdge(l, softness));
        orb.rgb *= 1.5; // boost it
        

        vec4 particlesBg = mix(gl_FragColor, orb, orb.a);
       gl_FragColor = particlesBg;
    }



    vec2 st = ( gl_FragCoord.xy-.5*u_resolution.xy) / u_resolution.y ;
    st.x *= u_resolution.x / u_resolution.y;
    
   
    vec2 m = u_mouse.xy/u_resolution.xy;
    st+=uv;
    st *= 15.;
    // st*=vec2(2.);
    st = fract(st)-0.5;
    float id = floor(st.x);
    float n = fract(sin(id*234.12)*5643.3)*2.-1.;
    //st = rotate2d( n*PI ) * st;
 
    //float h = Heart(st,m.y); // interact with mouse
    float blur = .0;
    blur = sin(u_time);
    blur = mix(-1.,.3,blur);
    float h = Heart(st,blur);
    float h2 = h/ .0001;
    float glow = .8;


    
  
  //-------color correction
    vec4 layer01 = vec4(0.0, 0.0, 0.0, 0.0);
    layer01 =pow(gl_FragColor, vec4(0.051, 1.0, 0.4157, 0.455));
    vec4 gamma = vec4(.0);
    gamma =pow(gl_FragColor, vec4(0.5529, 0.5529, 0.5529, 0.455));
    // gamma =pow(gl_FragColor, vec4(0.0, 0.0, 0.0, 0.455));
    gamma = mix(gamma, vec4(0.5294, 0.2941, 0.7451, 0.856), h2);
    gamma =saturate(gamma);
    gamma += layer01;

    gl_FragColor = gamma;

}