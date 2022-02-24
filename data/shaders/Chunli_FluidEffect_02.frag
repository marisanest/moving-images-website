#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform vec2        u_resolution;
uniform float       u_time;


vec4 fracture(vec2 x){
    return texture2D(u_buffer1, fract((x)/u_resolution));
}

float circle(vec2 coord, float radius) {
    return length(coord) - radius;
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,sin(0.1),
                0.0,_scale.y);
}

void main() {
    float waveScale = 1.1;
    float contribution = 0.001; // how much the new texture is affecting the old one
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 uv = gl_FragCoord.xy/u_resolution;

    vec4 old = texture2D(u_buffer1, uv);
    vec4 new = texture2D(u_buffer0, uv);

#ifdef BUFFER_0
    vec2 coord = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.; ;

    // START TO LOOK AT THE CODE HERE

    // what about getting a color c out of a coordinate?
    // do you remember what swizzling is? if not, look at 013-swizzling.glsl
    // vec4 c = coord.xxyy;

    // Exercise 1. What if you change the coord system?
    // vec4 c = (coord*0.75).xxyy * (sin(u_time*0.5));
    vec4 c = (coord * cos(u_time * 0.2)* 2.75).xxyy;
    // what is happening exactly? try debug the coordinate system
    // simply printing it in the BUFFER_0 section
    // gl_FragColor = c+circle(coord,1.);

    // How let's use our function "fracture"

    // Exercise 2.
    // Play with the fracture functiom
    // c += fracture(gl_FragCoord.xy + c.xy);
    // c += fracture(gl_FragCoord.xy - c.xy);
    // c += fracture(gl_FragCoord.xy / c.xy);
    // c += fracture(gl_FragCoord.xy-c.xy) * 2.7 -6.;
    c += fracture(gl_FragCoord.xy-c.xy) * 1.7 -6. * sin(u_time * 0.01) * 3.;
    // c += fracture(gl_FragCoord.xy-c.xy) * cos(u_time * 0.3)*2.7 -3.;

    // Exercise 3. in how many different ways can you mix a and sample again?
    // be creative!
    c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).rgba, .5);
    c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).argb, .6);
    c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).argb, .4);
   

    old *= 0.01;
    old += clamp(c, 0., (u_time * sin(.1))+1.1);




    // draw a simple circle as we already did many times in class
    vec2 off = vec2(0.);

    // animate the circle
    off += vec2(sin(u_time*4.), cos(u_time*4.)) * (sin(10.)*1.2);

    off += scale( vec2(sin(u_time)*cos(10.) +.0, cos(u_time)*sin(10.) +.0) ) * coord;
   
    //scale
    off *= scale( vec2((-u_time*.1)*sin(3.+sin(2.))) ) * coord;

    
    float cirA = circle(coord + off, abs(sin(.1)*4.));
    float cirB = circle(.01+ off , abs(sin(.1)*.1));

    vec4 circle1 = vec4(vec3(cirA), .5);
    vec4 circle2 = vec4(vec3(cirB), .1);
    vec4 circle = mix(circle1 ,circle2, .1);


    gl_FragColor = c+circle;
    // circle += 1.;


#elif defined( BUFFER_1 )
    gl_FragColor = texture2D(u_buffer0, uv);

#else    
    gl_FragColor = texture2D(u_buffer1, uv);
#endif
}