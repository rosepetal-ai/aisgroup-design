// Video-only experiments. Rolling surface and integer flat-top lattice ported from
// print/landscape.py. Absolute-time drawing: no RAF, random clock or dependencies.
window.videoPattern = function (L, c, option) {
  const cv = document.createElement('canvas'); cv.width = c.w; cv.height = c.h;
  Object.assign(cv.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' });
  L.prepend(cv);
  const g = cv.getContext('2d'), W = c.w, H = c.h, TAU = Math.PI * 2;
  const smooth = x => { x = Math.max(0, Math.min(1, x)); return x*x*(3-2*x); };
  let seed = (option.seed ?? 1112) >>> 0;
  const rnd = () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed/4294967296; };
  const bits = Array.from({length: 240}, () => ({x:rnd()*W,y:rnd()*H,p:rnd()*TAU,r:.65+rnd()*1.1,a:.12+rnd()*.36,dx:20+rnd()*70,dy:10+rnd()*30}));
  const height = (x,z) => 3*(.62*Math.sin(TAU*z/28+1.2*Math.sin(TAU*x/50)+.4)+.28*Math.sin(.55*TAU*z/28-TAU*x/85+1.9)+.1*Math.sin(1.9*TAU*z/28+TAU*x/40+.7));
  const edges = [], keys = new Map(), root = Math.sqrt(3);
  if (option.type === 'rolling') for(let j=2;j<65;j++) for(let i=-45;i<=45;i++) {
    const vv = [[2,0],[1,1],[-1,1],[-2,0],[-1,-1],[1,-1]].map(([x,z])=>[3*i+x,2*j+Math.abs(i%2)+z]);
    for(let k=0;k<6;k++) {
      const a=vv[k],b=vv[(k+1)%6],key=[a.join(','),b.join(',')].sort().join(':');
      const light = [[-7,10],[8,12],[-4,22],[12,32]].some(([x,z])=>i===x&&j===z), phase=(i+j)*.7;
      if(keys.has(key)) { if(light) Object.assign(keys.get(key), {light,phase}); continue; }
      const pts=Array.from({length:5},(_,n)=>{const x=(a[0]+(b[0]-a[0])*n/4)/2,z=(a[1]+(b[1]-a[1])*n/4)*root/2;return [x,height(x,z),z];});
      const edge={pts,light,phase}; edges.push(edge); keys.set(key,edge);
    }
  }
  // A wide quiet well protects either logo, including the taller AIS lockup.
  const quiet = (x,y) => option.quiet === false ? 1 : .06+.94*smooth((Math.hypot((x-W/2)/(W*.29),(y-H/2)/(H*.31))-.72)/.6);
  return t => {
    const period=option.period || 6, phase=TAU*((t % period + period) % period)/period;
    g.fillStyle='#0B1220';g.fillRect(0,0,W,H);
    if(option.type==='rolling') {
      const cx=.8*Math.sin(phase),cz=.7*Math.cos(phase),cy=10.6, pitch=8*Math.PI/180,F=.95*Math.sqrt(W*H);
      const project=([x,y,z])=>{const d=z-cz, yy=y-cy, depth=-yy*Math.sin(pitch)+d*Math.cos(pitch);return [W/2+F*(x-cx)/depth,H*.38-F*(yy*Math.cos(pitch)+d*Math.sin(pitch))/depth,depth];};
      for(const e of edges) {
        const mid=e.pts[2], p=project(mid); if(p[2]<4||p[0]<-100||p[0]>W+100||p[1]<0||p[1]>H+70) continue;
        const alpha=.58*Math.exp(-p[2]/80)*quiet(p[0],p[1]);
        g.strokeStyle=`rgba(124,159,215,${alpha*(e.light ? 1+1.4*(.5+.5*Math.sin(phase+e.phase))**4 : 1)})`;g.lineWidth=W/1920*1.15;g.beginPath();let pen=false;
        for(const v of e.pts) {
          let visible=true;
          // Continuous surface occlusion, including edges behind a crest.
          for(let n=1;n<25;n++){const s=n/25;if(height(cx+(v[0]-cx)*s,cz+(v[2]-cz)*s)>cy+(v[1]-cy)*s+.012){visible=false;break;}}
          const q=project(v); if(!visible){pen=false;continue;} if(pen)g.lineTo(q[0],q[1]);else g.moveTo(q[0],q[1]);pen=true;
        }g.stroke();
      }
    } else {
      const converge=option.loop ? .5-.5*Math.cos(phase) : smooth((t-.25)/1.5);
      for(let j=-1;j<13;j++)for(let i=-1;i<22;i++) {
        const r=W/30,x=i*r*1.5,y=j*r*root+(i%2)*r*root/2;
        const a=.075*converge*quiet(x,y);g.strokeStyle=`rgba(124,159,215,${a})`;g.lineWidth=1;
        g.beginPath();for(let k=0;k<=6;k++){const a=k*TAU/6;const xx=x+r*Math.cos(a),yy=y+r*Math.sin(a);if(k)g.lineTo(xx,yy);else g.moveTo(xx,yy);}g.stroke();
      }
      bits.forEach((b,i)=>{
        const targetX=Math.round(b.x/(W/20))*(W/20),targetY=Math.round(b.y/(H/12))*(H/12);
        const x=b.x+(targetX-b.x)*converge+b.dx*Math.sin(phase+b.p)*(1-.72*converge), y=b.y+(targetY-b.y)*converge+b.dy*Math.cos(phase+b.p)*(1-.72*converge);
        const a=b.a*quiet(x,y)*(.7+.3*Math.sin(phase+b.p));g.fillStyle=`rgba(124,159,215,${a})`;g.strokeStyle=g.fillStyle;g.lineWidth=1;
        if(i%4===0){const angle=(i%6)*TAU/6;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(angle)*9,y+Math.sin(angle)*9);g.stroke();}else{g.beginPath();g.arc(x,y,b.r,0,TAU);g.fill();}
      });
    }
    // Restrained blue falloff; never lightens the protected logo area.
    const wash=g.createRadialGradient(W*.72,H*.9,0,W*.72,H*.9,W*.55);wash.addColorStop(0,'rgba(54,100,179,.085)');wash.addColorStop(1,'rgba(23,53,110,0)');g.fillStyle=wash;g.fillRect(0,0,W,H);
  };
};
