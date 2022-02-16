#ifdef GL_ES
precision mediump float;
#endif


uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_tex0; // /data/textures/_5A_01093.jpg

void main(void){
    vec2 st = 2.0 * gl_FragCoord.xy / u_resolution - 1.0;
    st.x *= u_resolution.x / u_resolution.y;
    
    vec4 color = texture2D(u_tex0, vec2(st.x*0.6+0.5, st.y+0.5));
    
    gl_FragColor = color;
}
