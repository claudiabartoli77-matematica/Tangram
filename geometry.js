/* © 2026 Claudia Bartoli — uso didattico non commerciale. */
'use strict';
const Geo=(()=>{
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const signed=p=>p.reduce((s,a,i)=>{let b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0)/2;
 const area=p=>Math.abs(signed(p));
 const ccw=p=>signed(p)<0?[...p].reverse():p;
 const center=p=>p.reduce((s,a)=>[s[0]+a[0]/p.length,s[1]+a[1]/p.length],[0,0]);
 const bounds=ps=>{let p=ps.flat();return {x:Math.min(...p.map(a=>a[0])),y:Math.min(...p.map(a=>a[1])),r:Math.max(...p.map(a=>a[0])),b:Math.max(...p.map(a=>a[1]))}};
 function clip(subject,other){let out=subject.map(p=>[...p]);let q=ccw(other);for(let i=0;i<q.length;i++){let a=q[i],b=q[(i+1)%q.length],inp=out;out=[];if(!inp.length)break;for(let j=0;j<inp.length;j++){let p=inp[j],s=inp[(j+inp.length-1)%inp.length],dp=cross(a,b,p),ds=cross(a,b,s);if((dp>=-1e-8)!=(ds>=-1e-8)){let t=ds/(ds-dp);out.push([s[0]+t*(p[0]-s[0]),s[1]+t*(p[1]-s[1])]);}if(dp>=-1e-8)out.push(p)}}return out}
 const inside=(v,p)=>ccw(p).every((a,i,q)=>cross(a,q[(i+1)%q.length],v)>=-1e-6);
 const overlap=ps=>ps.reduce((s,p,i)=>s+ps.slice(i+1).reduce((t,q)=>t+area(clip(p,q)),0),0);
 // Perimetro dell'unione di poligoni con interni disgiunti: sottrae due volte ogni tratto condiviso.
 function perimeter(ps){let total=0,edges=[];ps.forEach((p,k)=>p.forEach((a,i)=>{let b=p[(i+1)%p.length],l=Math.hypot(b[0]-a[0],b[1]-a[1]);total+=l;edges.push({a,b,l,k})}));for(let i=0;i<edges.length;i++)for(let j=i+1;j<edges.length;j++){let e=edges[i],f=edges[j];if(e.k===f.k)continue;let ux=(e.b[0]-e.a[0])/e.l,uy=(e.b[1]-e.a[1])/e.l;if(Math.abs(cross(e.a,e.b,f.a))/e.l>1e-5||Math.abs(cross(e.a,e.b,f.b))/e.l>1e-5)continue;let a=(f.a[0]-e.a[0])*ux+(f.a[1]-e.a[1])*uy,b=(f.b[0]-e.a[0])*ux+(f.b[1]-e.a[1])*uy;total-=2*Math.max(0,Math.min(e.l,Math.max(a,b))-Math.max(0,Math.min(a,b)))}return total}
 const move=(p,dx,dy)=>p.map(a=>[a[0]+dx,a[1]+dy]);
 function rotate(p,degrees,c=center(p)){let a=degrees*Math.PI/180;return p.map(v=>[c[0]+(v[0]-c[0])*Math.cos(a)-(v[1]-c[1])*Math.sin(a),c[1]+(v[0]-c[0])*Math.sin(a)+(v[1]-c[1])*Math.cos(a)])}
 const match=(ps,qs)=>{let a=ps.reduce((s,p)=>s+area(p),0),b=qs.reduce((s,p)=>s+area(p),0),inter=ps.reduce((s,p)=>s+qs.reduce((t,q)=>t+area(clip(p,q)),0),0);return Math.max(0,a+b-2*inter)/b};
 function snap(p,others,threshold=12){let best=threshold,delta=[0,0];const consider=(dx,dy)=>{let d=Math.hypot(dx,dy);if(d<best){best=d;delta=[dx,dy]}};const project=(v,a,b)=>{let dx=b[0]-a[0],dy=b[1]-a[1],t=((v[0]-a[0])*dx+(v[1]-a[1])*dy)/(dx*dx+dy*dy);return t>=0&&t<=1?[a[0]+t*dx,a[1]+t*dy]:null};for(let v of p)for(let q of others)for(let i=0;i<q.length;i++){let w=q[i];consider(w[0]-v[0],w[1]-v[1]);let z=project(v,w,q[(i+1)%q.length]);if(z)consider(z[0]-v[0],z[1]-v[1])}for(let q of others)for(let w of q)for(let i=0;i<p.length;i++){let z=project(w,p[i],p[(i+1)%p.length]);if(z)consider(w[0]-z[0],w[1]-z[1])}return move(p,...delta)}
 const square=[[[0,0],[4,0],[2,2]],[[0,0],[2,2],[0,4]],[[4,2],[4,4],[2,4]],[[2,2],[3,1],[3,3]],[[0,4],[1,3],[2,4]],[[1,3],[2,2],[3,3],[2,4]],[[3,1],[4,0],[4,2],[3,3]]].map(p=>p.map(v=>v.map(x=>x/Math.SQRT2)));
 return {cross,area,ccw,center,bounds,clip,inside,overlap,perimeter,move,rotate,match,snap,square};
})();
if(typeof module!=='undefined')module.exports=Geo;
