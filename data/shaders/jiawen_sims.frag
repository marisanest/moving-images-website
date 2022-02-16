#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
#define PI 3.14159265359

float box(vec2 p,vec2 b){
    vec2 d=abs(p)-b;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
}

float circle(vec2 uv, float radius){
    return length(uv) - radius;
}
float hash(vec2 p){
    p=fract(p*vec2(234.34,435.345));
    p+=dot(p,p+34.23);
    return fract(p.x*p.y);
}
float fill(float dist,float size){
    return smoothstep(size,size,dist);
}
//perlin Noise
//0..1.0
//https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83#perlin-noise
float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
	float unit = u_resolution.x/freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noise(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float sNoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float sdRhombus( in vec2 p, in vec2 b ) 
{
    p = abs(p);
    float h = clamp( ndot(b-2.0*p,b)/dot(b,b), -1.0, 1.0 );
    float d = length( p-0.5*b*vec2(1.0-h,1.0+h) );
    return d * sign( p.x*b.y + p.y*b.x - b.x*b.y );
}

void main(){
    vec2 st = 2.0*gl_FragCoord.xy/u_resolution-1.0;
    st.x*=u_resolution.x/u_resolution.y * hash(st*sNoise(vec2(u_time,u_time*0.12)));
    
    vec4 colorA = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 colorB = vec4(sin(u_time*0.2)*st.y);
    vec4 colorC = vec4(0.1765, 0.1765, 0.1765, 1.0);

    float positionX = sNoise(vec2(u_time*0.1,u_time*0.12));
    float positionY = sNoise(vec2(u_time*0.07,u_time*0.05));

    float positionA = pNoise(vec2(u_time*0.1,u_time*0.09)*500.0,1);
    float positionB = pNoise(vec2(sin(u_time*0.12)*400.0,u_time*0.21*400.0),1);
    
    float circleA = circle(vec2(positionX,positionY),0.01);
    circleA = fill(circleA,pNoise(vec2(u_time*0.1)*100.,1)*0.1);

    for(int i = 0; i<20; i++){
        float posX = sNoise(vec2(u_time*0.1+float(i),u_time*0.12+float(i)));
        float posY = sNoise(vec2(u_time*0.07+float(i),u_time*0.05+float(i)));
        
        circleA *= fill(circle(st+vec2(0.0,posY),0.01),sin(u_time+float(i*10)*0.15)*0.01);
    }

    float rhombus = fill(sdRhombus(st-vec2(0.0,0.0), vec2(0.5,0.9)),0.0001);

    vec4 result = mix(colorA,colorB,circleA);
    result = mix(result,colorC,rhombus);

    st = 2.0*gl_FragCoord.xy/u_resolution-1.0;
    st.x*=u_resolution.x/u_resolution.y;

    float stripe = box(vec2(st+vec2(1.1,0.0)),vec2(1.,1.));
    result += fill(stripe,0.1);

    gl_FragColor = result;
}