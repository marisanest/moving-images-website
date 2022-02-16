#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float merge(float d1, float d2){
	return min(d1, d2);
}

#define PI 3.14159265358979323846

float plot_x_vals(vec2 st, float pct){
    return  smoothstep( pct - sin(u_time), pct, st.y) -
            smoothstep( pct, pct + cos(u_time), st.y);
}

float plot_y_vals(vec2 st, float pct){
    return  smoothstep( pct + abs(cos(u_time)), pct, st.x) -
            smoothstep( pct, pct + abs(cos(u_time)), st.x);
}

void main(){
    vec2 _st = 2.0 * gl_FragCoord.xy / u_resolution.xy - 1.0;
    _st.x *= u_resolution.x / u_resolution.y;

    _st*=10.0;
    _st.y += step(1., mod(_st.x,2.0)) * cos(u_time);
    _st=fract(_st);
    
    float line = plot_x_vals(_st, abs(sin(u_time)));
    float yline = plot_y_vals(_st, abs(sin(u_time)));

    float twoLines = merge(line, yline);

    vec4 color = mix(vec4(_st.x, 0.0, 0.0, 1.0),vec4(_st.x, 9.0, 1.0, 1.0), twoLines);
    gl_FragColor=color;
}