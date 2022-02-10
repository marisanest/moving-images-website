#ifdef GL_ES
precision mediump float;
#endif



uniform vec2 u_resolution;
uniform float u_time;

float circle(vec2 coord, vec2 loc, float size){
    float r = distance(loc, coord) * 3.;
    return r - size;
    // return smoothstep(size, size + 0.3, r);
    
}
// vec3 circle(vec2 loc, vec2 coord){
//     float r = distance(loc, coord);
//     // return step(0.5, r);
//     return mix(vec3(1., 0., 0.6),  vec3(0., 1., 0.), r);
// }

// float circle2D(vec2 pos, float radius){
//     float d = length(pos) * 2.0 - radius;
//     return d;
// }

float merge(float a , float b){
    
    float m = min(a, b);
    return m;
}

// float random2D(float x){
//     float rand = fract(sin(x * 5324.7) * 6144.8 /35.);
//     // return rand * 2. -0.2;
//     return rand * 2. ;
// }
float random2D(float x){
    float rand = fract(sin(x * 14.7) * 99.8 * 10.);
    // return rand * 2. -0.2;
    return rand;
}

// float random2D(float x){
//     float rand = fract(sin(x * 564.7) * 264274.8);
//     return rand;
// }
// float random2D(float x){
//     float rand = fract(sin(x * .315) * 12.2);
//     return rand;
// }

void main(){
    vec2 coord = 2. * gl_FragCoord.xy/u_resolution - 1.;
    coord.x *= u_resolution.x/u_resolution.y;
    
    

    vec4 result = vec4(1., 1., 1., 1.0);
    vec4 colorA = vec4(0.9, 0., 0., 1.);
    vec4 colorB = vec4(0., 0.0, 0.9, 1.);
    vec4 colorC = vec4(1., 1., 1., 1.);
    

    for(float i = 0.; i < 1.4; i+= 0.1){
        float randSin = random2D(i + i) > 0.5 ? (sin(u_time * random2D(i + i))) : (-sin(u_time * random2D(i + i))) * random2D(i + i) + random2D(i + i);
        float randCos = random2D(i + i) > 0.3 ? (cos(u_time * random2D(i + i))) : (-cos(u_time * random2D(i + i))) * random2D(i + i) + random2D(i + i);
        float circleA = circle(coord, vec2(sin(u_time * random2D(i)) * random2D(i) + random2D(i), cos(u_time * random2D(i)) * random2D(i) + random2D(i)), random2D(i));
        float circleB = circle(coord, vec2(randSin, randCos), fract(random2D(i) * random2D(i)));
        result = mix(result, vec4(random2D(i + random2D(i + i)), random2D(i + random2D(i + i + i)), random2D(i + random2D(i + i + i)), 1.), merge(circleA, circleB));
        result *= mix(result, vec4(random2D(i + random2D(i + i)), random2D(i + random2D(i + i + i)), random2D(i + random2D(i + i + i)), 1.), merge(-circleA, -circleB));
        // result /= mix(result, vec4(random2D(i + random2D(i + i)), random2D(i + random2D(i + i + i)), random2D(i + random2D(i + i + i)), 1.), merge(-circleA, -circleB));

    }
   
  

    



    gl_FragColor = result;
}