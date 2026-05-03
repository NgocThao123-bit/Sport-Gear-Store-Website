// ============================================================
// FILE: components/ui/Ballpit.jsx
// SOURCE: ReactBits (reactbits.dev) — Backgrounds → Ballpit
// CUSTOMISED: ball colors changed to sports-themed palette
//             màu bóng đổi thành bảng màu thể thao
//
// HOW IT WORKS / CÁCH HOẠT ĐỘNG:
//  - Uses THREE.js (3D library) to render shiny 3D spheres on a <canvas>
//    Dùng THREE.js để render các khối cầu 3D bóng loáng trên <canvas>
//  - Custom physics engine (class W) handles gravity + ball collisions
//    Engine vật lý tuỳ chỉnh (class W) xử lý trọng lực + va chạm giữa bóng
//  - MeshPhysicalMaterial with subsurface scattering = glossy ball look
//    Vật liệu vật lý với tán xạ dưới bề mặt = trông như bóng thật
//  - Mouse/touch moves a hidden "control sphere" that pushes balls away
//    Chuột/touch di chuyển một quả cầu ẩn đẩy các bóng ra xa
//
// HOW TO USE IN HOME PAGE / CÁCH DÙNG TRONG HOME PAGE:
//   <Ballpit
//     count={80}
//     gravity={0.5}
//     colors={[0xFF6B00, 0xC8FF00, 0x9B5CF6]}
//     followCursor={true}
//   />
// ============================================================

import { useEffect, useRef } from 'react';
import {
  // Physics vectors / Vector vật lý
  Vector3 as a,
  Vector2 as r,
  // Scene graph
  Scene as i,
  Object3D as m,         // dummy transform used to feed InstancedMesh matrices
  // Geometry + Material
  InstancedMesh as d,    // render N balls in a single draw call / render N bóng trong 1 draw call
  SphereGeometry as g,   // unit sphere geometry shared across all instances
  MeshPhysicalMaterial as c, // clearcoat + metalness = shiny ball look
  Color as l,
  // Lights
  AmbientLight as f,
  PointLight as u,
  // Renderer
  WebGLRenderer as s,
  SRGBColorSpace as n,
  ACESFilmicToneMapping as v, // cinematic tone mapping for vivid colors
  // Camera + interaction
  PerspectiveCamera as t,
  Plane as w,
  Raycaster as y,
  // Helpers
  MathUtils as o,
} from 'three';

// ── Minimal timer — replaces deprecated THREE.Clock ─────────
// Bộ đếm thời gian tối giản — thay thế THREE.Clock đã deprecated
//
// THREE.Clock was deprecated in r168 in favour of THREE.Timer,
// but THREE.Timer only ships in r170+. Instead of upgrading Three.js,
// we implement the same getDelta/start/stop API using performance.now().
// THREE.Clock bị deprecated trong r168, nhưng THREE.Timer chỉ có từ r170+.
// Thay vì nâng cấp Three.js, chúng ta tự implement API getDelta/start/stop
// dùng performance.now() — không phụ thuộc vào phiên bản Three.js.
function makeTimer(){
  let last=0,running=false;
  return{
    start(){ last=performance.now()/1000; running=true; },
    stop(){  running=false; },
    getDelta(){
      const now=performance.now()/1000;
      const delta=running?(now-last):0;
      last=now;
      return delta;
    }
  };
}

// ── Three.js scene manager ──────────────────────────────────
// Quản lý scene Three.js (camera, renderer, resize, animation loop)
class x {
  #e;canvas;camera;cameraMinAspect;cameraMaxAspect;cameraFov;maxPixelRatio;minPixelRatio;scene;renderer;#t;
  size={width:0,height:0,wWidth:0,wHeight:0,ratio:0,pixelRatio:0};
  render=this.#i;onBeforeRender=()=>{};onAfterRender=()=>{};onAfterResize=()=>{};
  #s=false;#n=false;isDisposed=false;#o;#r;#a;#c=makeTimer();#h={elapsed:0,delta:0};#l;
  constructor(e){this.#e={...e};this.#m();this.#d();this.#p();this.resize();this.#g();}
  #m(){this.camera=new t();this.cameraFov=this.camera.fov;}
  #d(){this.scene=new i();}
  #p(){
    if(this.#e.canvas){this.canvas=this.#e.canvas;}
    else if(this.#e.id){this.canvas=document.getElementById(this.#e.id);}
    else{console.error('Three: Missing canvas or id parameter');}
    this.canvas.style.display='block';
    const e={canvas:this.canvas,powerPreference:'high-performance',...(this.#e.rendererOptions??{})};
    this.renderer=new s(e);this.renderer.outputColorSpace=n;
  }
  #g(){
    if(!(this.#e.size instanceof Object)){
      window.addEventListener('resize',this.#f.bind(this));
      if(this.#e.size==='parent'&&this.canvas.parentNode){
        this.#r=new ResizeObserver(this.#f.bind(this));this.#r.observe(this.canvas.parentNode);
      }
    }
    this.#o=new IntersectionObserver(this.#u.bind(this),{root:null,rootMargin:'0px',threshold:0});
    this.#o.observe(this.canvas);
    document.addEventListener('visibilitychange',this.#v.bind(this));
  }
  #y(){window.removeEventListener('resize',this.#f.bind(this));this.#r?.disconnect();this.#o?.disconnect();document.removeEventListener('visibilitychange',this.#v.bind(this));}
  #u(e){this.#s=e[0].isIntersecting;this.#s?this.#w():this.#z();}
  #v(){if(this.#s){document.hidden?this.#z():this.#w();}}
  #f(){if(this.#a)clearTimeout(this.#a);this.#a=setTimeout(this.resize.bind(this),100);}
  resize(){
    let e,t;
    if(this.#e.size instanceof Object){e=this.#e.size.width;t=this.#e.size.height;}
    else if(this.#e.size==='parent'&&this.canvas.parentNode){e=this.canvas.parentNode.offsetWidth;t=this.canvas.parentNode.offsetHeight;}
    else{e=window.innerWidth;t=window.innerHeight;}
    this.size.width=e;this.size.height=t;this.size.ratio=e/t;this.#x();this.#b();this.onAfterResize(this.size);
  }
  #x(){
    this.camera.aspect=this.size.width/this.size.height;
    if(this.camera.isPerspectiveCamera&&this.cameraFov){
      if(this.cameraMinAspect&&this.camera.aspect<this.cameraMinAspect){this.#A(this.cameraMinAspect);}
      else if(this.cameraMaxAspect&&this.camera.aspect>this.cameraMaxAspect){this.#A(this.cameraMaxAspect);}
      else{this.camera.fov=this.cameraFov;}
    }
    this.camera.updateProjectionMatrix();this.updateWorldSize();
  }
  #A(e){const t=Math.tan(o.degToRad(this.cameraFov/2))/(this.camera.aspect/e);this.camera.fov=2*o.radToDeg(Math.atan(t));}
  updateWorldSize(){
    if(this.camera.isPerspectiveCamera){
      const e=(this.camera.fov*Math.PI)/180;
      this.size.wHeight=2*Math.tan(e/2)*this.camera.position.length();
      this.size.wWidth=this.size.wHeight*this.camera.aspect;
    }else if(this.camera.isOrthographicCamera){
      this.size.wHeight=this.camera.top-this.camera.bottom;
      this.size.wWidth=this.camera.right-this.camera.left;
    }
  }
  #b(){
    this.renderer.setSize(this.size.width,this.size.height);
    this.#t?.setSize(this.size.width,this.size.height);
    let e=window.devicePixelRatio;
    if(this.maxPixelRatio&&e>this.maxPixelRatio){e=this.maxPixelRatio;}
    else if(this.minPixelRatio&&e<this.minPixelRatio){e=this.minPixelRatio;}
    this.renderer.setPixelRatio(e);this.size.pixelRatio=e;
  }
  get postprocessing(){return this.#t;}
  set postprocessing(e){this.#t=e;this.render=e.render.bind(e);}
  #w(){
    if(this.#n)return;
    const animate=()=>{this.#l=requestAnimationFrame(animate);this.#h.delta=this.#c.getDelta();this.#h.elapsed+=this.#h.delta;this.onBeforeRender(this.#h);this.render();this.onAfterRender(this.#h);};
    this.#n=true;this.#c.start();animate();
  }
  #z(){if(this.#n){cancelAnimationFrame(this.#l);this.#n=false;this.#c.stop();}}
  #i(){this.renderer.render(this.scene,this.camera);}
  clear(){
    this.scene.traverse(e=>{
      if(e.isMesh&&typeof e.material==='object'&&e.material!==null){
        Object.keys(e.material).forEach(t=>{const i=e.material[t];if(i!==null&&typeof i==='object'&&typeof i.dispose==='function'){i.dispose();}});
        e.material.dispose();e.geometry.dispose();
      }
    });
    this.scene.clear();
  }
  dispose(){this.#y();this.#z();this.clear();this.#t?.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.isDisposed=true;}
}

// ── Pointer / Touch interaction manager ────────────────────
// Quản lý tương tác chuột và cảm ứng
const b=new Map(),A=new r();let R=false;
function S(e){
  const t={position:new r(),nPosition:new r(),hover:false,touching:false,onEnter(){},onMove(){},onClick(){},onLeave(){},...e};
  (function(e,t){
    if(!b.has(e)){
      b.set(e,t);
      if(!R){
        document.body.addEventListener('pointermove',M);document.body.addEventListener('pointerleave',L);document.body.addEventListener('click',C);
        document.body.addEventListener('touchstart',TouchStart,{passive:false});document.body.addEventListener('touchmove',TouchMove,{passive:false});
        document.body.addEventListener('touchend',TouchEnd,{passive:false});document.body.addEventListener('touchcancel',TouchEnd,{passive:false});
        R=true;
      }
    }
  })(e.domElement,t);
  t.dispose=()=>{const t=e.domElement;b.delete(t);if(b.size===0){document.body.removeEventListener('pointermove',M);document.body.removeEventListener('pointerleave',L);document.body.removeEventListener('click',C);document.body.removeEventListener('touchstart',TouchStart);document.body.removeEventListener('touchmove',TouchMove);document.body.removeEventListener('touchend',TouchEnd);document.body.removeEventListener('touchcancel',TouchEnd);R=false;}};
  return t;
}
function M(e){A.x=e.clientX;A.y=e.clientY;processInteraction();}
function processInteraction(){for(const[elem,t]of b){const i=elem.getBoundingClientRect();if(D(i)){P(t,i);if(!t.hover){t.hover=true;t.onEnter(t);}t.onMove(t);}else if(t.hover&&!t.touching){t.hover=false;t.onLeave(t);}}}
function C(e){A.x=e.clientX;A.y=e.clientY;for(const[elem,t]of b){const i=elem.getBoundingClientRect();P(t,i);if(D(i))t.onClick(t);}}
function L(){for(const t of b.values()){if(t.hover){t.hover=false;t.onLeave(t);}}}
function TouchStart(e){if(e.touches.length>0){e.preventDefault();A.x=e.touches[0].clientX;A.y=e.touches[0].clientY;for(const[elem,t]of b){const rect=elem.getBoundingClientRect();if(D(rect)){t.touching=true;P(t,rect);if(!t.hover){t.hover=true;t.onEnter(t);}t.onMove(t);}}}}
function TouchMove(e){if(e.touches.length>0){e.preventDefault();A.x=e.touches[0].clientX;A.y=e.touches[0].clientY;for(const[elem,t]of b){const rect=elem.getBoundingClientRect();P(t,rect);if(D(rect)){if(!t.hover){t.hover=true;t.touching=true;t.onEnter(t);}t.onMove(t);}else if(t.hover&&t.touching){t.onMove(t);}}}}
function TouchEnd(){for(const[,t]of b){if(t.touching){t.touching=false;if(t.hover){t.hover=false;t.onLeave(t);}}}}
function P(e,t){const{position:i,nPosition:s}=e;i.x=A.x-t.left;i.y=A.y-t.top;s.x=(i.x/t.width)*2-1;s.y=(-i.y/t.height)*2+1;}
function D(e){const{x:t,y:i}=A;const{left:s,top:n,width:o,height:r}=e;return t>=s&&t<=s+o&&i>=n&&i<=n+r;}

// ── Physics engine ──────────────────────────────────────────
// Engine vật lý: trọng lực, va chạm giữa các bóng, nảy tường
const{randFloat:k,randFloatSpread:E}=o;
const F=new a(),I=new a(),O=new a(),V=new a(),B=new a(),N=new a(),_=new a(),j=new a(),H=new a(),T=new a();
class W{
  constructor(e){this.config=e;this.positionData=new Float32Array(3*e.count).fill(0);this.velocityData=new Float32Array(3*e.count).fill(0);this.sizeData=new Float32Array(e.count).fill(1);this.center=new a();this.#R();this.setSizes();}
  #R(){const{config:e,positionData:t}=this;this.center.toArray(t,0);for(let i=1;i<e.count;i++){const s=3*i;t[s]=E(2*e.maxX);t[s+1]=E(2*e.maxY);t[s+2]=E(2*e.maxZ);}}
  setSizes(){const{config:e,sizeData:t}=this;t[0]=e.size0;for(let i=1;i<e.count;i++){t[i]=k(e.minSize,e.maxSize);}}
  update(e){
    const{config:t,center:i,positionData:s,sizeData:n,velocityData:o}=this;
    let r=0;
    if(t.controlSphere0){r=1;F.fromArray(s,0);F.lerp(i,0.1).toArray(s,0);V.set(0,0,0).toArray(o,0);}
    for(let idx=r;idx<t.count;idx++){const base=3*idx;I.fromArray(s,base);B.fromArray(o,base);B.y-=e.delta*t.gravity*n[idx];B.multiplyScalar(t.friction);B.clampLength(0,t.maxVelocity);I.add(B);I.toArray(s,base);B.toArray(o,base);}
    for(let idx=r;idx<t.count;idx++){
      const base=3*idx;I.fromArray(s,base);B.fromArray(o,base);const radius=n[idx];
      for(let jdx=idx+1;jdx<t.count;jdx++){const otherBase=3*jdx;O.fromArray(s,otherBase);N.fromArray(o,otherBase);const otherRadius=n[jdx];_.copy(O).sub(I);const dist=_.length();const sumRadius=radius+otherRadius;if(dist<sumRadius){const overlap=sumRadius-dist;j.copy(_).normalize().multiplyScalar(0.5*overlap);H.copy(j).multiplyScalar(Math.max(B.length(),1));T.copy(j).multiplyScalar(Math.max(N.length(),1));I.sub(j);B.sub(H);I.toArray(s,base);B.toArray(o,base);O.add(j);N.add(T);O.toArray(s,otherBase);N.toArray(o,otherBase);}}
      if(t.controlSphere0){_.copy(F).sub(I);const dist=_.length();const sumRadius0=radius+n[0];if(dist<sumRadius0){const diff=sumRadius0-dist;j.copy(_.normalize()).multiplyScalar(diff);H.copy(j).multiplyScalar(Math.max(B.length(),2));I.sub(j);B.sub(H);}}
      if(Math.abs(I.x)+radius>t.maxX){I.x=Math.sign(I.x)*(t.maxX-radius);B.x=-B.x*t.wallBounce;}
      if(t.gravity===0){if(Math.abs(I.y)+radius>t.maxY){I.y=Math.sign(I.y)*(t.maxY-radius);B.y=-B.y*t.wallBounce;}}
      else if(I.y-radius<-t.maxY){I.y=-t.maxY+radius;B.y=-B.y*t.wallBounce;}
      const maxBoundary=Math.max(t.maxZ,t.maxSize);
      if(Math.abs(I.z)+maxBoundary>maxBoundary){I.z=Math.sign(I.z)*(t.maxZ-radius);B.z=-B.z*t.wallBounce;}
      I.toArray(s,base);B.toArray(o,base);
    }
  }
}


// ── Default config — CUSTOMISED for SportGear Store ─────────
// Cấu hình mặc định — ĐÃ TUỲ CHỈNH cho SportGear Store
//
// colors: gradient across all balls (interpolated)
//   0xFF6B00 = basketball orange (màu cam bóng rổ)
//   0xC8FF00 = lime / soccer on grass (màu xanh chanh / bóng đá)
//   0x9B5CF6 = purple brand color (màu tím thương hiệu)
//   0x38BCFF = blue / swimming (màu xanh dương / bơi lội)
//   0xFF3D3D = red sports energy (màu đỏ năng lượng thể thao)
const X={
  count: 150,
  colors: [0xFF6B00, 0xC8FF00, 0x9B5CF6, 0x38BCFF, 0xFF3D3D, 0xFFFFFF],
  ambientColor: 0xffffff,
  ambientIntensity: 1.2,
  lightIntensity: 250,
  materialParams: {
    metalness: 0.05,    // low metalness = looks like rubber/plastic ball
                        // metalness thấp = trông như bóng cao su/nhựa
    roughness: 0.1,     // low roughness = shiny surface / bề mặt bóng
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  },
  minSize: 0.4,
  maxSize: 1.0,
  size0: 0,             // 0 = cursor sphere invisible / quả cầu con trỏ vô hình
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5, maxY: 5, maxZ: 2,
  controlSphere0: false,
  followCursor: true,
};

// ── InstancedMesh of balls ──────────────────────────────────
// Lưới instanced của các bóng (dùng instancing để render nhiều bóng hiệu quả)
//
// WHY no PMREMGenerator / envMap? / TẠI SAO không dùng PMREMGenerator / envMap?
// PMREMGenerator.fromScene() renders a scene into a framebuffer internally.
// If the WebGL canvas has zero dimensions at construction time (before first
// resize() fires), the framebuffer is invalid and MeshPhysicalMaterial's
// shader fails to compile ("Fragment shader is not compiled").
// We avoid this by skipping the env-map and using direct point lights instead.
// The balls still look shiny via clearcoat + high metalness + three point lights.
//
// PMREMGenerator.fromScene() render scene vào framebuffer nội bộ.
// Nếu canvas WebGL có kích thước bằng 0 lúc khởi tạo (trước khi resize() chạy),
// framebuffer không hợp lệ và shader của MeshPhysicalMaterial thất bại.
// Chúng ta tránh điều này bằng cách bỏ env-map và dùng đèn point light trực tiếp.
const U=new m();
class Z extends d{
  constructor(e,t={}){
    const i={...X,...t};
    const o=new g();
    // MeshPhysicalMaterial without envMap — works on any canvas size
    // MeshPhysicalMaterial không dùng envMap — hoạt động với mọi kích thước canvas
    const r=new c({
      metalness:        i.materialParams.metalness        ?? 0.2,
      roughness:        i.materialParams.roughness        ?? 0.15,
      clearcoat:        i.materialParams.clearcoat        ?? 1.0,
      clearcoatRoughness: i.materialParams.clearcoatRoughness ?? 0.1,
    });
    super(o,r,i.count);
    this.config=i;this.physics=new W(i);this.#S();this.setColors(i.colors);
  }
  #S(){
    // Stronger ambient + 3-point lighting replaces the env-map reflection
    // Ambient mạnh hơn + đèn 3 điểm thay thế phản chiếu env-map
    this.ambientLight=new f(this.config.ambientColor,2.5);
    this.add(this.ambientLight);
    // Key light (main) — follows cursor ball / Đèn chính — theo quả cầu con trỏ
    this.light=new u(0xffffff,400);
    this.light.position.set(5,5,10);
    this.add(this.light);
    // Fill light — soft from below / Đèn phụ — nhẹ từ phía dưới
    const fill=new u(0x9B5CF6,150);
    fill.position.set(-5,-5,5);
    this.add(fill);
    // Rim light — back highlight / Đèn viền — nổi bật phía sau
    const rim=new u(0xC8FF00,100);
    rim.position.set(0,10,-5);
    this.add(rim);
  }
  setColors(e){
    if(Array.isArray(e)&&e.length>1){
      const t=(function(e){
        let t,i;
        function setColors(e){t=e;i=[];t.forEach(col=>{i.push(new l(col));});}
        setColors(e);
        return{setColors,getColorAt:function(ratio,out=new l()){const scaled=Math.max(0,Math.min(1,ratio))*(t.length-1);const idx=Math.floor(scaled);const start=i[idx];if(idx>=t.length-1)return start.clone();const alpha=scaled-idx;const end=i[idx+1];out.r=start.r+alpha*(end.r-start.r);out.g=start.g+alpha*(end.g-start.g);out.b=start.b+alpha*(end.b-start.b);return out;}};
      })(e);
      for(let idx=0;idx<this.count;idx++){this.setColorAt(idx,t.getColorAt(idx/this.count));if(idx===0){this.light.color.copy(t.getColorAt(idx/this.count));}}
      this.instanceColor.needsUpdate=true;
    }
  }
  update(e){
    this.physics.update(e);
    for(let idx=0;idx<this.count;idx++){
      U.position.fromArray(this.physics.positionData,3*idx);
      if(idx===0&&this.config.followCursor===false){U.scale.setScalar(0);}
      else{U.scale.setScalar(this.physics.sizeData[idx]);}
      U.updateMatrix();this.setMatrixAt(idx,U.matrix);
      if(idx===0)this.light.position.copy(U.position);
    }
    this.instanceMatrix.needsUpdate=true;
  }
}

// ── createBallpit factory ───────────────────────────────────
// Hàm tạo Ballpit — khởi tạo scene, physics, mouse interaction
function createBallpit(e,t={}){
  const i=new x({canvas:e,size:'parent',rendererOptions:{antialias:true,alpha:true}});
  let s;
  i.renderer.toneMapping=v;
  i.camera.position.set(0,0,20);
  i.camera.lookAt(0,0,0);
  i.cameraMaxAspect=1.5;
  i.resize();
  initialize(t);
  const n=new y();
  const o=new w(new a(0,0,1),0);
  const r=new a();
  let c_paused=false;

  e.style.touchAction='none';
  e.style.userSelect='none';
  e.style.webkitUserSelect='none';

  const h=S({
    domElement:e,
    onMove(){n.setFromCamera(h.nPosition,i.camera);i.camera.getWorldDirection(o.normal);n.ray.intersectPlane(o,r);s.physics.center.copy(r);s.config.controlSphere0=true;},
    onLeave(){s.config.controlSphere0=false;}
  });
  function initialize(e){if(s){i.clear();i.scene.remove(s);}s=new Z(i.renderer,e);i.scene.add(s);}
  i.onBeforeRender=e=>{if(!c_paused)s.update(e);};
  i.onAfterResize=e=>{s.config.maxX=e.wWidth/2;s.config.maxY=e.wHeight/2;};
  return{
    three:i,
    get spheres(){return s;},
    setCount(e){initialize({...s.config,count:e});},
    togglePause(){c_paused=!c_paused;},
    dispose(){h.dispose();i.dispose();}
  };
}

// ── React component ─────────────────────────────────────────
// Component React — bọc toàn bộ logic Three.js bên trong
//
// Props:
//   className    — Tailwind classes for sizing (e.g. "w-full h-full absolute inset-0")
//   followCursor — whether balls react to mouse (default: true)
//   count        — number of balls (default: 150)
//   colors       — hex color array interpolated across balls
//   gravity      — downward pull strength (default: 0.5)
//
// WHY containerRef instead of canvasRef? / TẠI SAO dùng containerRef thay vì canvasRef?
// React 18 Strict Mode runs effects TWICE in dev mode:
//   Mount → effect → cleanup (disposes WebGL context) → re-mount → effect again
// If we reuse the same <canvas> element, the second WebGLRenderer creation fails
// because the WebGL context was already lost in the first cleanup.
// FIX: create a brand-new <canvas> DOM element each time the effect runs.
// That way, each invocation gets a fresh canvas with no prior context.
//
// React 18 Strict Mode chạy effect HAI LẦN trong dev mode:
//   Mount → effect → cleanup (huỷ WebGL context) → re-mount → effect lại
// Nếu dùng lại cùng một <canvas>, lần tạo WebGLRenderer thứ hai sẽ thất bại
// vì WebGL context đã bị mất trong lần cleanup đầu tiên.
// FIX: tạo một phần tử <canvas> DOM hoàn toàn mới mỗi lần effect chạy.
const Ballpit = ({ className = '', followCursor = true, ...props }) => {
  const containerRef    = useRef(null);
  const ballpitInstance = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Programmatically create a fresh <canvas> so we never reuse a canvas
    // whose WebGL context was already disposed.
    // Tạo <canvas> mới bằng code, tránh dùng lại canvas đã bị dispose WebGL context.
    const canvas = document.createElement('canvas');
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Create the ballpit and store the instance for cleanup
    // Tạo ballpit và lưu instance để dọn dẹp sau
    ballpitInstance.current = createBallpit(canvas, { followCursor, ...props });

    return () => {
      // Cleanup: stop animation loop + free GPU memory + remove canvas from DOM
      // Dọn dẹp: dừng animation + giải phóng GPU + xoá canvas khỏi DOM
      ballpitInstance.current?.dispose();
      ballpitInstance.current = null;
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render a plain div container — canvas is inserted into it by the effect
  // Render div container đơn giản — canvas được chèn vào bởi effect
  return <div ref={containerRef} className={`${className} w-full h-full`} />;
};

export default Ballpit;
