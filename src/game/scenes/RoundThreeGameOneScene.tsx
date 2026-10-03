import {useEffect,useRef,useState,type CSSProperties,type PointerEvent}from'react';
import {BackButton}from'../components/BackButton';
import {useGame}from'../GameContext';
import introBackground from'../../assets/round3/backgrounds/round3-intro-bg.png';
import mapArtwork from'../../assets/round3/game1/map/vietnam-map.png';
import trungVuong from'../../assets/round3/game1/characters/trung-vuong.png';
import dinhBoLinh from'../../assets/round3/game1/characters/dinh-bo-linh.png';
import lyCongUan from'../../assets/round3/game1/characters/ly-cong-uan.png';
import hoQuyLy from'../../assets/round3/game1/characters/ho-quy-ly.png';
import quangTrung from'../../assets/round3/game1/characters/quang-trung.png';

type Id='meLinh'|'hoaLu'|'thangLong'|'tayDo'|'phuXuan';
type P={x:number;y:number};
type S='opening'|'opening-exit'|'playing'|'correct'|'completed'|'leaving';

export const ROUND3_LOCATIONS:Record<Id,{label:string;x:number;y:number;labelX:number;labelY:number}>={
  meLinh:{label:'MÊ LINH',x:43.1,y:17.4,labelX:-78,labelY:-15},
  thangLong:{label:'THĂNG LONG',x:46.2,y:20.7,labelX:13,labelY:-7},
  hoaLu:{label:'HOA LƯ',x:44.5,y:27.1,labelX:-73,labelY:4},
  tayDo:{label:'TÂY ĐÔ',x:47.1,y:34.2,labelX:13,labelY:3},
  phuXuan:{label:'PHÚ XUÂN',x:51.2,y:45.8,labelX:13,labelY:3}
};

export const ROUND3_CHARACTERS=[
  {id:'trung-vuong',name:'Trưng Vương',location:'meLinh' as Id,image:trungVuong},
  {id:'dinh-bo-linh',name:'Đinh Bộ Lĩnh',location:'hoaLu' as Id,image:dinhBoLinh},
  {id:'ly-cong-uan',name:'Lý Công Uẩn',location:'thangLong' as Id,image:lyCongUan},
  {id:'ho-quy-ly',name:'Hồ Quý Ly',location:'tayDo' as Id,image:hoQuyLy},
  {id:'quang-trung',name:'Quang Trung',location:'phuXuan' as Id,image:quangTrung}
];

export function RoundThreeIntroScene(){
  const{dispatch}=useGame();
  return <section className="round3-intro chapter-scene">
    <div className="round3-intro-landscape" style={{backgroundImage:`url(${introBackground})`}}/>
    <div className="round3-intro-mist"/>
    <BackButton onClick={()=>dispatch({type:'RETURN_TO_MAP'})}/>
    <div className="chapter-panel chapter-entry-panel round3-intro-panel">
      <p>ROUND III</p>
      <h1>DẤU CHÂN KINH ĐÔ</h1>
      <b>NHỮNG DẤU CHÂN TẠO NÊN BẢN ĐỒ ĐẠI VIỆT</b>
      <span>Kết nối nhân vật – kinh đô – thời gian.</span>
      <div>
        <GameButton onClick={()=>dispatch({type:'START_ROUND_THREE_GAME1'})}>BẮT ĐẦU HÀNH TRÌNH</GameButton>
      </div>
    </div>
  </section>;
}

// Import GameButton locally to avoid circular dependency
function GameButton({onClick,children}:{onClick:()=>void;children:React.ReactNode}){
  return <button className="game-button primary" onClick={onClick}>{children}</button>;
}

export function RoundThreeGameOneScene(){
  const{dispatch}=useGame();
  const stage=useRef<HTMLDivElement>(null);
  const ref=useRef<HTMLButtonElement>(null);
  const frames=useRef<number[]>([]);
  const dragFrame=useRef<number|null>(null);
  const pendingPosition=useRef<P|null>(null);
  const completionTimer=useRef<number|null>(null);
  const sequenceTimers=useRef<number[]>([]);

  const[i,setI]=useState(0);
  const[done,setDone]=useState<Id[]>([]);
  const[pos,setPos]=useState<P|null>(null);
  const[drag,setDrag]=useState(false);
  const[status,setStatus]=useState<S>('playing');
  const[completionLit,setCompletionLit]=useState(-1);
  const[wrongLocation,setWrongLocation]=useState<Id|null>(null);
  const[returning,setReturning]=useState(false);

  const a=ROUND3_CHARACTERS[i];

  useEffect(()=>()=>{
    frames.current.forEach(cancelAnimationFrame);
    if(dragFrame.current!==null)cancelAnimationFrame(dragFrame.current);
    if(completionTimer.current!==null)window.clearTimeout(completionTimer.current);
    sequenceTimers.current.forEach(window.clearTimeout);
  },[]);

  const later=(fn:()=>void,ms:number)=>sequenceTimers.current.push(window.setTimeout(fn,ms));

  const hit=(x:number,y:number)=>{
    const r=stage.current?.getBoundingClientRect();
    return r?(Object.keys(ROUND3_LOCATIONS)as Id[]).find(id=>{
      const p=ROUND3_LOCATIONS[id];
      return Math.hypot(x-r.left-r.width*p.x/100,y-r.top-r.height*p.y/100)<=Math.min(55,r.width*.045);
    })??null:null;
  };

  const down=(e:PointerEvent<HTMLButtonElement>)=>{
    if(status!=='playing'||returning||!ref.current||!stage.current)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const b=ref.current.getBoundingClientRect();
    const r=stage.current.getBoundingClientRect();
    const start={x:b.left-r.left,y:b.top-r.top};
    pendingPosition.current=start;
    setPos(start);
    setDrag(true);
  };

  const move=(e:PointerEvent<HTMLButtonElement>)=>{
    if(!drag||!ref.current||!stage.current)return;
    const b=ref.current.getBoundingClientRect();
    const r=stage.current.getBoundingClientRect();
    pendingPosition.current={x:e.clientX-r.left-b.width/2,y:e.clientY-r.top-b.height*.96};
    if(dragFrame.current!==null)return;
    dragFrame.current=requestAnimationFrame(()=>{
      dragFrame.current=null;
      const next=pendingPosition.current;
      if(!next||!ref.current)return;
      ref.current.style.setProperty('--round3-character-x',`${next.x}px`);
      ref.current.style.setProperty('--round3-character-y',`${next.y}px`);
    });
  };

  const up=(e:PointerEvent<HTMLButtonElement>)=>{
    if(!drag||status!=='playing')return;
    if(dragFrame.current!==null){
      cancelAnimationFrame(dragFrame.current);
      dragFrame.current=null;
    }
    setDrag(false);
    const id=hit(e.clientX,e.clientY);
    if(!id||id!==a.location){
      setWrongLocation(id);
      setReturning(true);
      setPos(null);
      later(()=>{setWrongLocation(null);setReturning(false);},430);
      return;
    }

    // Calculate final position
    const r=stage.current!.getBoundingClientRect();
    const b=ref.current!.getBoundingClientRect();
    const p=ROUND3_LOCATIONS[id];
    const end:P={x:r.width*p.x/100-b.width/2,y:r.height*p.y/100-b.height+8};

    // IMMEDIATELY move to final position + mark done + advance
    setPos(end);
    const nextDone=[...done,id];
    setDone(nextDone);
    setStatus('correct');

    if(nextDone.length===5){
      setStatus('completed');
      [0,230,460,690,920].forEach((delay,index)=>later(()=>setCompletionLit(index),delay));
      later(()=>setStatus('leaving'),2200);
      completionTimer.current=window.setTimeout(()=>dispatch({type:'COMPLETE_ROUND_THREE_GAME1'}),2750);
    } else {
      // Advance to next character on next frame
      const f=requestAnimationFrame(()=>frames.current.push(requestAnimationFrame(()=>{
        setI(n=>n+1);
        setPos(null);
        setStatus('playing');
      })));
      frames.current.push(f);
    }
  };

  const style:CSSProperties|undefined=pos?{
    '--round3-character-x':`${pos.x}px`,
    '--round3-character-y':`${pos.y}px`
  }as CSSProperties:undefined;

  const startGame=()=>{
    if(status!=='opening')return;
    setStatus('opening-exit');
    later(()=>setStatus('playing'),420);
  };

  return <section className={`round3-game1 status-${status}`}>
    <BackButton onClick={()=>status==='playing'&&dispatch({type:'RETURN_TO_MAP'})}/>
    <header className="round3-game1-header">
      <p>ROUND III</p>
      <h1>DẤU CHÂN KINH ĐÔ</h1>
    </header>
    <div className="round3-map-stage" ref={stage}>
      <img className="round3-map-image" src={mapArtwork}/>

      {(Object.keys(ROUND3_LOCATIONS)as Id[]).map((id,index)=>{
        const p=ROUND3_LOCATIONS[id];
        const c=done.includes(id)?ROUND3_CHARACTERS.find(x=>x.location===id):null;
        return <div key={id} className={`round3-location ${done.includes(id)?'is-completed':''} ${completionLit>=index?'is-final-lit':''} ${wrongLocation===id?'is-wrong':''}`} style={{left:`${p.x}%`,top:`${p.y}%`}as CSSProperties}>
          {c&&<img className="round3-placed-character" src={c.image}/>}
          <div className="round3-drop-zone"/>
          <i className="round3-marker-dot"/>
          <span className="round3-location-label" style={{'--label-x':`${p.labelX}px`,'--label-y':`${p.labelY}px`}as CSSProperties}>{p.label}</span>
        </div>;
      })}

      {a&&status!=='completed'&&status!=='leaving'&&<button
        ref={ref}
        className={`round3-active-character ${pos?'is-transform-positioned':''} ${drag?'is-dragging':''}`}
        style={style}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
      >
        <img src={a.image}/>
      </button>}
      {wrongLocation!==null&&<div className="round3-feedback">Dấu chân này chưa đúng vị trí.</div>}
      {(status==='completed'||status==='leaving')&&<div className="round3-restored"><b>DẤU CHÂN KINH ĐÔ</b><strong>Những dấu chân đã hội tụ trên bản đồ Đại Việt.</strong></div>}
      {(status==='opening'||status==='opening-exit')&&<div className="round3-game1-opening-panel"><div className="round3-game1-opening-inner"><p>ROUND III</p><h1>DẤU CHÂN KINH ĐÔ</h1><b>Những dấu chân tạo nên bản đồ Đại Việt</b><button className="game-button" onClick={startGame}>BẮT ĐẦU HÀNH TRÌNH</button></div></div>}
    </div>
  </section>;
}

export function RoundThreeGameOneCompleteScene(){
  return null;
}
