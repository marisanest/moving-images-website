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
    vec4 color = vec4(0.0, 1.0, 0.4157, 1.0);
    vec2 uv = gl_FragCoord.xy/u_resolution;

    vec4 old = texture2D(u_buffer1, uv);
    vec4 new = texture2D(u_buffer0, uv);

#ifdef BUFFER_0
    vec2 coord = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0; ;

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
    c += fracture(gl_FragCoord.xy-c.xy) * 2.7 -6.;
    //c += fracture(gl_FragCoord.xy-c.xy) * 1.7 -6. * sin(u_time * 0.01) * 3.;
    // c += fracture(gl_FragCoord.xy-c.xy) * cos(u_time * 0.3)*2.7 -3.;

    // Exercise 3. in how many different ways can you mix a and sample again?
    // be creative!
    // c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).rgba, .5);
    // c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).argb, .2);
    // c = mix(fracture(gl_FragCoord.xy+c.xy)*0.4, fract(c).argb, .2);
    c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c/vec4(2.7)).argb, .2);
    // c = mix(fracture(gl_FragCoord.xy+c.xy), fract(c).argb, .2);
   
    // Exercise 4.
    // Those 3 lines are just a way to combine together, the 3 variables old, new, and c
    // in the result c.
    // can you try other way to combine them?
    old *= 0.01;
    old += clamp(c, 0., (u_time * sin(.1))+1.1);
    // c = old*(contribution) + new ;
    c = new*(contribution) + old;
    // c= new + old;



    // END, after this part is nothing new, you know it already.
    // If those exercises where not enough, try to draw something that is not a circle



    // draw a simple circle as we already did many times in class
    vec2 off = vec2(0.);
    float feedbackCtrlA = 0.0;
    // animate the circle
    // off = scale( vec2(sin(u_time)*2. +1.0) ) * coord;
    off = vec2(sin(u_time), cos(u_time)) * 0.2;
    // if (feedbackCtrlA < 2.0){
    //     feedbackCtrlA += 1.0;
    //     off = scale( vec2(-u_time*.1) ) * coord;

    //  }
    //  else{
    //      feedbackCtrlA -= 1.0;
    //      off = scale( vec2(u_time*.1) ) * coord;

    //  }

    //scale
    // off = scale( vec2(-u_time*.1) ) * coord;

    
    float cir = circle(coord + off, abs(sin(.1)*0.5));
    vec4 circle = vec4(vec3(cir), .01);


    gl_FragColor = c+circle;
    circle += 1.;


#elif defined( BUFFER_1 )
    gl_FragColor = texture2D(u_buffer0, uv);

#else    
    gl_FragColor = texture2D(u_buffer1, uv);
#endif
}