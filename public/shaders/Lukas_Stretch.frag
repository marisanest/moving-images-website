#ifdef GL_ES
    precision mediump float;
#endif

uniform sampler2D u_tex0; // /textures/_5A_01093.jpg
uniform vec2 u_resolution;
uniform float u_time;

void main(void) {
    vec2 st = 2.0 * gl_FragCoord.xy / u_resolution - 1.0 ;
    st.x *= u_resolution.x / u_resolution.y;

    float m = (.5*sin(u_time*0.009)+0.5);

    vec4 color = texture2D(u_tex0, vec2(0.5*m+0.5, 0.5*st.y+0.5));

    gl_FragColor = vec4(color);
}