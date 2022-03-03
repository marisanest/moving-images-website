#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;
uniform vec2        u_resolution;
uniform float       u_time;
uniform vec2 u_mouse;


vec3 subImg(vec2 fragCoord, float xs,float ys, float zs){
    vec2 xy=gl_FragCoord.xy/u_resolution.xy;
    xy-=0.5;
    xy+=vec2(sin(u_time*xs)*0.1,cos(u_time*ys)*0.1);//move
    xy*=(1.1+sin(u_time*zs)*0.1);//scale
    xy+=0.5;
    return texture2D(u_buffer0,xy).xyz;
}
vec3 drawCircle( vec2 xy){
    float l=length(xy);
    return ( l>.233 || l<.184 ) ? vec3(0) : vec3(sin(l*128.0)*.5+0.5);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 m = u_mouse.xy/u_resolution.xy;
    vec2 uv = gl_FragCoord.xy/u_resolution;
    vec2 xy=u_resolution.xy;
    xy=-.5*(xy-2.0*gl_FragCoord.xy)/xy.x;
    xy*=1.0+sin(u_time*4.0)*0.2;
    xy.x+=sin(xy.x*32.0+u_time*16.0)*0.01;
    xy.y+=sin(xy.y*16.0+u_time*8.0)*0.01;

    uv.x *= 1.7;
    if(mod(uv.y,.7)<1.0){
        uv.x *= 3.;
        uv.y *= 5.;
        uv.x += step(1.,mod(uv.y,2.))*.5;
        if(mod(uv.x,10.)<1.0){
        uv.x *= sin(uv.x)*10.*abs(sin(u_time/5.));
        uv.y *= 15.;
        uv.x += step(1.,mod(uv.y,2.*abs(sin(u_time/5.))))*.5;
        

    }

    }
uv *= .15;
m*=clamp(m.x,0.8,0.9);

////////////////////////////anything above is common part////////////////////


/////////////////////////// buffer0 /////////////////////////////////////////
#ifdef BUFFER_0
        vec3 c=drawCircle(xy);
    

 
    vec3 fC=
        subImg(uv,3.3,3.1,2.5)*vec3(0.3,0.7,1.0)+
        subImg(uv,2.4,4.3,3.3)*vec3(0.3,1.0,0.7)+
        subImg(uv,2.2,4.2,4.2)*vec3(1.0,0.7,0.3)+
        subImg(uv,3.2,3.2,2.1)*vec3(1.0,0.3,0.7)+
        subImg(uv,2.2,1.2,3.4)*vec3(0.3,0.5,0.7)+
        subImg(uv,5.2,2.2,2.2)*vec3(0.8,0.5,0.1);
    
    gl_FragColor = vec4((fC/3.6+c)*0.95,1.0);

///////////////////////////////// buffer1//////////////////////////////
#elif defined( BUFFER_1 )
vec2 uv01,uv02=gl_FragCoord.xy/u_resolution;
float u_time01,u_time02=u_time;
float circle = length(uv02);

uv01+=uv02/circle
        *(sin(u_time02)+1.)
		*abs(sin(circle*7.-(u_time02)*.000005)*1.7);
uv01=(fract(uv01 *2.));

float rndCol = random(uv01/0.0001);


gl_FragColor = texture2D(u_buffer0, uv01*rndCol);
vec4 gamma = vec4(.0);
gamma =pow(gl_FragColor, vec4(0.0275, 0.2863, 0.3216, 0.455));
gl_FragColor = gamma;

///////////////////////////////final///////////////////////////////////
#else    
    gl_FragColor = texture2D(u_buffer1, uv);
#endif
}