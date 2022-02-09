#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


float dcircle(vec2 coord, vec2 loc){
    float d = distance(coord, loc);
    float s = smoothstep(0.1, 0.7, d);
    return s;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float merge(float x, float y){
    return min(x, y);
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
void main (){
    vec2 coord = 2. * gl_FragCoord.xy/u_resolution - 1.;
    coord.x *= u_resolution.x/u_resolution.y;
    
    coord *= 1.2;
    coord *= scale(vec2(sin(u_time * 0.1) * 4.)) * coord;
  
    vec3 col = vec3(0.);

    //circle
    float circle1 = dcircle(coord, vec2(sin(u_time) * sin(u_time), cos(u_time) * sin(u_time)));
    float circle2 = dcircle(coord, vec2(cos(u_time) * 0.2, sin(u_time) * 0.2));
    
    //merging circles
    float merge1 = merge(circle1, circle2);

    //🤯try something crazy
    merge1 = merge1 + length(coord) * sin(length(coord) * 7. + u_time * 2.);

    //rotate is vec2 => downgrading by using dot? or just rotate.x, rotate.y;
    merge1 *= (rotate2d(u_time*0.3) * coord).y;
    merge1 /= (rotate2d(u_time) * coord).x;
   
    
    vec3 mixColor = mix(vec3(0.0471, 0.3961, 0.4667), vec3(0.0039, 0.0, 0.0588), merge1);
    vec3 mixColor2 = mix(vec3(0.0471, 0.3961, 0.4667), vec3(0.8549, 0.851, 0.9137), mixColor);

    col = mixColor2;


    //try something crazy
    gl_FragColor = vec4(0.01/(col * (length((rotate2d(sin(u_time)) * coord).x * (coord.y + sin(u_time) + coord.x + cos(u_time))))), 1.);

}