#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

vec2 random2d( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}


float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);


    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}



void main(){
    vec3 color = vec3(0.0);
    vec2 st = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;

    st *= abs(sin(u_time * 0.1)) * 50.0;
    st.x += sin(st.y * cos(u_time)); 
    st.y += sin(st.x * sin(u_time));

    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float min_dist = 1.0;
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {

            vec2 neighbour = vec2(float(x), float(y));

            vec2 point = random2d(i_st + neighbour);
            point = 0.5 + 0.5 * point * sin(u_time + 4.5);

            vec2 diff = point + neighbour - f_st;
            float dist = length(diff);

            min_dist = min(dist, min_dist);
        }
    }

    vec2 point = random2d(i_st);

    float scale = 4.0;
    vec2 pos = vec2(st*scale);
    float n = noise(pos);

    color = vec3(0.0,min_dist,1.0);
    gl_FragColor=vec4(color, n * (abs(sin(u_time)*0.5)+2.0));
}