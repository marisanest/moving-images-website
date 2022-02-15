//function /* Main function, uniforms & utils */
#ifdef GL_ES
    precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float ball(vec2 uv, vec2 center, float radius)
{
    return length(uv/center) - radius;
}

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
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

float rand(float n){return fract(sin(n) * 43758.5453123);}
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution * 2. -1.;
    st.x *= u_resolution.x / u_resolution.y;

    st *= 2.;

    float s = sin(u_time);
    float c = cos(u_time);

    float sx = 2. * snoise(vec2(u_time*0.005, sin(u_time)*0.05));
    float sy = 2. * snoise(vec2(u_time*0.003, cos(u_time)*0.03));


    float circles = 1.;
    vec2 p = (2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;
    circles = ball(st, vec2(0.), .2);

    for(int i = 0; i < 15; i++) {
        vec2 sn = vec2(snoise(vec2(float(i),u_time*0.09)), snoise(vec2(u_time*0.07, float(i)))) * 2.;
        circles *= ball(st, vec2(sn), float(i)*0.07);
    }

    gl_FragColor = vec4(circles);
}