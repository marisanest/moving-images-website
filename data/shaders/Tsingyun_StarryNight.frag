

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.1415
#define S(x,y,z) smoothstep(x,y,z)
#define B(x,y,z,b) S(x, x+b, z)*S(y+b, y, z)
#define saturate(x) clamp(x,0.,1.)

#define MOD3 vec3(.1031,.11369,.13787)
#define MOONPOS vec2(1.3, .8)-vec2(0.6,0.1)


//-------------------------for layer01---------------------------------------

vec2 tile(vec2 st, float zoom){
    st *= zoom;
    return fract(st);
}

float circle(vec2 st, float radius){
    vec2 pos = vec2(0.5)-st;
    radius *= 0.75;
    return 1.-smoothstep(radius-(radius*0.05),radius+(radius*0.05),dot(pos,pos)*3.14);
}


float circlePattern(vec2 st, float radius) {
    return  circle(st+vec2(0.,-.5), radius)+
            circle(st+vec2(0.,.5), radius)+
            circle(st+vec2(-.5,0.), radius)+
            circle(st+vec2(.5,0.), radius);
}

float sdMoon(vec2 p, float d, float ra, float rb )
{
    p.y = abs(p.y);
    float a = (ra*ra - rb*rb + d*d)/(2.0*d);
    float b = sqrt(max(ra*ra-a*a,0.0));
    if( d*(p.x*b-p.y*a) > d*d*max(b-p.y,0.0) )
          return length(p-vec2(a,b));
    return max( (length(p          )-ra),
               -(length(p-vec2(d,0))-rb));
}

//-------------------------for layer02---------------------------------------

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


float within(float a, float b, float t) {
	return (t-a) / (b-a); 
}


float getheight(float x) {
    return sin(x) + sin(x*2.234+.123)*.5*sin(x)*0.5 + sin(x*4.45+2.2345)*.25;
}

vec4 landscape(vec2 uv, float d, float p, float f, float a, float y, float seed, float focus) {
	uv *= d;
    float x = uv.x*PI*f+p;
    float c = getheight(x)*a+y;
    
    float b = floor(x*5.)/5.+.1;
    float h =  getheight(b)*a+y;
    
    float blur = 0.0005;

    
    vec4 col = vec4(S(c+blur, c-blur, uv.y));
    return saturate(col);
}

vec4 gradient(vec2 uv) {
    
	// float c = 1.-length(MOONPOS-uv)/1.4; // invert b&w
    float c = 1.-length(MOONPOS-uv)/.8;
    vec4 col = vec4(c);
    
    return col;
}

float circ(vec2 uv, vec2 pos, float radius, float blur) {
	float dist = length(uv-pos);
    return S(radius+blur, radius-blur, dist);
}

vec4 moon(vec2 uv) {
   	float c = circ(uv, MOONPOS, .07, .001);
    
    c *= 1.-circ(uv, MOONPOS+vec2(.03), .07, .001)*.95;
    c = saturate(c);
    
    vec4 col = vec4(c);
    col.rgb *=.8;
    
    return col;
}

vec4 moonglow(vec2 uv, float foreground) {
    
   	float c = circ(uv, MOONPOS, .1, .3);
    
    vec4 col = vec4(c);
    col.rgb *=.2;
    
    return col;
}

float stars(vec2 uv, float t) {
    t*=3.;
    
    float n1 = hash12(uv*10000.);
    float n2 = hash12(uv*11234.);
    float alpha1 = pow(n1, 20.);
    float alpha2 = pow(n2, 20.);
    
    float twinkle = sin((uv.x-t+cos(uv.y*20.+t))*10.);
    twinkle *= cos((uv.y*.234-t*3.24+sin(uv.x*12.3+t*.243))*7.34);
    twinkle = (twinkle + 1.)/2.;
    return alpha1 * alpha2 * twinkle;
}

//---------------------------------------------------------------------

void main(){
    /////////////coord for layer01///////////////////
    vec2 coord = gl_FragCoord.xy / u_resolution.xy;
 
    // the coord system which is effected by sine noise
    vec2 wavedPos = vec2(
    coord.x + sin(coord.y * 30.0)*sin(u_time) * 0.1,
    coord.y + sin(coord.x * 30.0) * 0.1
    );

    /////////////coord01 for layer01///////////////////  
    vec2 coord01 = gl_FragCoord.xy/u_resolution.xy;
    coord01.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0, 0.0, 0.0);

    /////////////coord02 for layer02///////////////////
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

   //-----------------01----------------------------------
    vec2 grid1 = tile(coord01,7.);
    grid1 = tile(coord01 + vec2(cos(u_time),sin(u_time))*0.01,7.);

    float halo = sdMoon(grid1-vec2(0.5),0.01,0.4,0.2);

    // 1.1 no circles upon
    // color += mix(vec3(0.075,0.114,0.329),vec3(0.973,0.843,0.675),halo);

    //circlePattern(wavedPos,0.01) => noised circles
    //1.2 blurry halos+noised black circle
    color += mix(vec3(0.075,0.114,0.329),vec3(0.973,0.843,0.675),halo-circlePattern(wavedPos,0.08));
    
    vec3 layer01 = vec3(.0);
    vec2 grid2 = vec2(.0);
    grid2 = tile(coord01 + vec2(cos(u_time),sin(u_time))*0.02 ,3.);
    layer01 = mix(color, vec3(0.761,0.247,0.102), circlePattern(grid2,0.2)) - circlePattern(wavedPos,0.05);

    //---------------02--------------------------------------
    float t = u_time*.05;
     
    vec2 bgUV = uv*vec2(u_resolution.x/u_resolution.y, 1.);
    uv.x *= u_resolution.x/u_resolution.y;
    vec4 layer02 = gradient(bgUV)*.8;

    layer02 += moon(bgUV);
    layer02 += stars(uv, t);
    
    float dist = .10;
    float height = -.01;
    float amplitude = .05;
    
    dist = 1.2;
    height = .65;
    
    vec4 trees = vec4(0.);
    for(float i=0.; i<10.; i++) {    
    	vec4 layer = landscape(uv, dist, t+i, 3., amplitude, height, i, .01);
    	layer.rgb *= mix(vec3(0.0, 0.0, 0.0), vec3(0.3059, 0.3059, 0.3059)+gradient(uv).x, 1.-i/10.);
        trees = mix(trees, layer, layer.a);
        
        dist -= .1;
        height -= .06;
    }
    layer02 = mix(layer02, trees, trees.a);
    
    layer02 += moonglow(bgUV, 1.);
    layer02 = saturate(layer02);
    
    vec4 foreground = landscape(uv, .02, t, 3., .0, -0.04, 1., .1);
    foreground.rgb *= vec3(0.1)*.5;
    
    layer02 = mix(layer02, foreground, foreground.a);
    vec4 layer = vec4(layer01,1.);
    layer02 = mix(layer, layer02, abs(sin(u_time*0.8)*1.));


    gl_FragColor = vec4(layer02);
}
