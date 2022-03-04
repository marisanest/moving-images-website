#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p){
    p=fract(p*vec2(23.4,4.345));
    p+=dot(p,p+324.23);
    return fract(p.x*p.y);
}

bool myCircle(vec2 coord, float radius){
    float d = length(coord) - radius;
    return d < 0.0;
}

float myShape(vec2 coord){
    return (coord.x + coord.y);
}



void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color;
    vec3 colorLayerB = vec3(0.6784, 0.1804, 0.5529);
    vec3 bgColor = vec3(st, 0.0);
    float timer = .15 + cos(u_time + sin(u_time / 4.) - cos(u_time / 3.)) * tan(u_time * .0125) + 0.2;

    st*= 4. * 12.;
    vec2 id = floor(st);
    st.x = fract(st.x) - .75;
    st.y = fract(st.y) - .25;

    float randomValue = hash(id);
   
    if(randomValue < .66){
        st.x *= -0.5;
        st.y /= .15 + (sin(u_time * .5) / 2.) * abs(sin(u_time * timer/ .66)) ;
        //+ .35 * abs(sin(u_time * timer/ 2.));
    }
    if(randomValue > .33){
        st.y /= st.x * .5 * sin(u_time * timer/4.);
        st.x /= (sin(u_time * timer/2.)) ;
    }

    st.x -= .5;
    st.y /= st.x;

    if(myCircle(st, sin(3.*u_time)/2. + 1.) ){
        color = vec3(0.9216, 0.9137, 0.8784);
    }else{
        color = vec3(0.0, 0.0, 0.0);
    };

    vec3 layerB = color;
        
    //bgColor = mix(colorLayerB, color, layerB);

    gl_FragColor = vec4(layerB, 1.);
    }

    // play with overlap layers, play with paralax effect: front moving slower than back
    // play with myShape