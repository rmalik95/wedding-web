import { useEffect, useRef, useState } from 'react';
const photos = [
 {src:'embrace',alt:'Rishabh embracing Glyra on a stone balcony',caption:'My favourite place is next to you.'},
 {src:'woodland',alt:'Rishabh and Glyra looking back together in the woods',caption:'Every little adventure. Every ordinary day.'},
 {src:'balcony',alt:'Rishabh and Glyra together beside a historic stone building',caption:'Different places. Always us.'},
];
export default function PhotoCarousel(){
 const [index,setIndex]=useState(0);const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);const [hover,setHover]=useState(false);const touch=useRef<number|null>(null);
 const move=(n:number)=>setIndex(i=>(i+n+photos.length)%photos.length);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{if(media.matches)setPlaying(false)};media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 useEffect(()=>{if(!playing||hover)return;const id=setInterval(()=>setIndex(i=>(i+1)%photos.length),5500);return()=>clearInterval(id)},[playing,hover]);
 return <section id="moments" className="moments section-pad reveal" aria-roledescription="carousel" aria-label="Our photographs" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setHover(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHover(false)}}>
 <div className="moments-copy"><span className="eyebrow">02 / A few pages from our story</span><h2>All the miles.<br/>All the <em>moments.</em></h2><p>Between the flights and the farewells, we made a life full of little things worth keeping.</p><div className="carousel-controls"><button aria-label="Previous photograph" onClick={()=>move(-1)}>←</button><span>{String(index+1).padStart(2,'0')} <i>/ 03</i></span><button aria-label="Next photograph" onClick={()=>move(1)}>→</button><button className="play-control" onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Pause slideshow':'Play slideshow'}>{playing?'Pause':'Play'}</button></div></div>
 <div className="photo-stack" onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{if(touch.current!==null){const d=e.changedTouches[0].clientX-touch.current;if(Math.abs(d)>40)move(d>0?-1:1);touch.current=null}}}><div className="stack-back"/><div className="stack-back second"/><div className="photo-window">{photos.map((p,i)=><img key={p.src} className={i===index?'active':''} src={`/images/${p.src}.webp`} alt={p.alt} aria-hidden={i!==index} width="1000" height="1100" loading="lazy"/>)}</div><p className="photo-caption" aria-live={playing?'off':'polite'}>{photos[index].caption}</p><span className="photo-corner" aria-hidden="true">R & G</span></div>
 </section>
}
