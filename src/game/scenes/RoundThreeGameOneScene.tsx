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
type H='idle'|'correct'|'exit'|'enter';
type O='idle'|'restore'|'message'|'fade';

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
  const{dispatch,state}=useGame();
  const mapStage=useRef<HTMLDivElement>(null);
  const characterRef=useRef<HTMLButtonElement>(null);
  const dragLayerRef=useRef<HTMLButtonElement>(null);
  const locationRefs=useRef<Partial<Record<Id,HTMLDivElement|null>>>({});
  const indicatorRef=useRef<HTMLDivElement>(null);
  const frame=useRef<number|null>(null);
  const timers=useRef<number[]>([]);
  const pointerId=useRef<number|null>(null);
  const dragPosition=useRef({left:0,top:0});
  const locked=useRef(false);
  const completionDispatched=useRef(false);
  const[i,setI]=useState(0);
  const[done,setDone]=useState<Id[]>([]);
  const[drag,setDrag]=useState(false);
  const[status,setStatus]=useState<S>(state.currentScene==='ROUND_THREE_INTRO'?'opening':'playing');
  const[handoff,setHandoff]=useState<H>('idle');
  const[outro,setOutro]=useState<O>('idle');
  const[completionLit,setCompletionLit]=useState(-1);
  const[wrongLocation,setWrongLocation]=useState<Id|null>(null);
  const[nearestLocation,setNearestLocation]=useState<Id|null>(null);
  const[visible,setVisible]=useState(true);
  const a=ROUND3_CHARACTERS[i];
  const ids=Object.keys(ROUND3_LOCATIONS) as Id[];

  useEffect(()=>()=>{
    if(frame.current!==null)cancelAnimationFrame(frame.current);
    timers.current.forEach(window.clearTimeout);
    if(pointerId.current!==null&&characterRef.current?.hasPointerCapture(pointerId.current))characterRef.current.releasePointerCapture(pointerId.current);
  },[]);

  useEffect(()=>{
    if(handoff==='enter')resetDragPosition();
  },[handoff]);

  const later=(fn:()=>void,ms:number)=>timers.current.push(window.setTimeout(fn,ms));
  const setDragPosition=(left:number,top:number)=>{
    dragPosition.current={left,top};
    [characterRef.current,dragLayerRef.current].forEach(element=>{
      element?.style.setProperty('--round3-drag-left',`${left}px`);
      element?.style.setProperty('--round3-drag-top',`${top}px`);
    });
  };
  const resetDragPosition=()=>{
    characterRef.current?.style.removeProperty('--round3-drag-left');
    characterRef.current?.style.removeProperty('--round3-drag-top');
    dragLayerRef.current?.style.removeProperty('--round3-drag-left');
    dragLayerRef.current?.style.removeProperty('--round3-drag-top');
  };
  const placeDragAtPointer=(x:number,y:number)=>{
    const preview=dragLayerRef.current?.getBoundingClientRect();
    const width=preview?.width??62;
    const height=preview?.height??75;
    const edge=8;
    const left=Math.min(Math.max(edge,x-width-16),Math.max(edge,window.innerWidth-width-edge));
    const top=Math.min(Math.max(edge,y-height-20),Math.max(edge,window.innerHeight-height-edge));
    setDragPosition(left,top);
  };
  const closestLocation=(x:number,y:number,allowCompleted=false)=>ids.map(id=>{
    if(!allowCompleted&&done.includes(id))return null;
    const zone=locationRefs.current[id]?.querySelector('.round3-drop-zone');
    const r=zone?.getBoundingClientRect();
    if(!r)return null;
    const dx=x-(r.left+r.width/2);
    const dy=y-(r.top+r.height/2);
    const distance=Math.hypot(dx,dy);
    return distance<=Math.max(r.width,r.height)/2?{id,distance}:null;
  }).filter((value):value is {id:Id;distance:number}=>value!==null).sort((left,right)=>left.distance-right.distance)[0]?.id??null;
  const hit=(x:number,y:number)=>closestLocation(x,y);
  const updatePointer=(x:number,y:number)=>{
    if(indicatorRef.current){
      indicatorRef.current.style.setProperty('--round3-pointer-x',`${x}px`);
      indicatorRef.current.style.setProperty('--round3-pointer-y',`${y}px`);
    }
    const next=closestLocation(x,y);
    setNearestLocation(previous=>previous===next?previous:next);
  };
  const clearPointer=()=>{
    if(frame.current!==null){cancelAnimationFrame(frame.current);frame.current=null;}
    setNearestLocation(null);
    if(indicatorRef.current)indicatorRef.current.style.removeProperty('opacity');
  };

  const down=(e:PointerEvent<HTMLButtonElement>)=>{
    if(status!=='playing'||locked.current||!characterRef.current)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerId.current=e.pointerId;
    setDrag(true);
    updatePointer(e.clientX,e.clientY);
    placeDragAtPointer(e.clientX,e.clientY);
  };
  const move=(e:PointerEvent<HTMLButtonElement>)=>{
    if(!drag||!characterRef.current)return;
    const update=()=>{
      frame.current=null;
      updatePointer(e.clientX,e.clientY);
      placeDragAtPointer(e.clientX,e.clientY);
    };
    if(frame.current!==null)return;
    frame.current=requestAnimationFrame(update);
  };
  const up=(e:PointerEvent<HTMLButtonElement>)=>{
    if(!drag||status!=='playing'||locked.current||!characterRef.current)return;
    if(characterRef.current.hasPointerCapture(e.pointerId))characterRef.current.releasePointerCapture(e.pointerId);
    pointerId.current=null;
    clearPointer();
    const target=hit(e.clientX,e.clientY);
    if(target!==a.location){
      setDrag(false);
      setWrongLocation(target);
      later(()=>{setWrongLocation(null);resetDragPosition();},520);
      return;
    }
    locked.current=true;
    const zone=locationRefs.current[target]?.querySelector('.round3-drop-zone')?.getBoundingClientRect();
    const b=(dragLayerRef.current??characterRef.current).getBoundingClientRect();
    if(zone)setDragPosition(zone.left+zone.width/2-b.width/2,zone.top+zone.height/2-b.height*.82);
    setStatus('correct');
    setDrag(false);
    setNearestLocation(target);
    const nextDone=[...done,target];
    if(nextDone.length===5){
      later(()=>{
        setDone(nextDone);
        setVisible(false);
        setStatus('completed');
        setOutro('restore');
        [0,180,360,540,720].forEach((delay,index)=>later(()=>setCompletionLit(index),delay));
        later(()=>setOutro('message'),680);
        later(()=>setOutro('fade'),2080);
        later(()=>{
          if(completionDispatched.current)return;
          completionDispatched.current=true;
          dispatch({type:'COMPLETE_ROUND_THREE_GAME1'});
        },2530);
      },520);
    }else{
      setHandoff('correct');
      later(()=>setHandoff('exit'),180);
      later(()=>{
        resetDragPosition();
        setDone(nextDone);
        setI(value=>value+1);
        setStatus('playing');
        setHandoff('enter');
        setNearestLocation(null);
      },380);
      later(()=>{
        setHandoff('idle');
        locked.current=false;
      },760);
    }
  };
  const startGame=()=>{
    if(status!=='opening')return;
    dispatch({type:'START_ROUND_THREE_GAME1'});
    setStatus('opening-exit');
    later(()=>setStatus('playing'),420);
  };
  const characterStyle={ '--round3-drag-left':`${dragPosition.current.left}px`,'--round3-drag-top':`${dragPosition.current.top}px` } as CSSProperties;

  return <section className={`round3-game1 status-${status} handoff-${handoff}`}>
    <BackButton onClick={()=>status==='playing'&&handoff==='idle'&&!drag&&dispatch({type:'RETURN_TO_MAP'})}/>
    <div className="round3-game1-layout">
      <aside className="round3-character-panel">
        <p className="round3-game1-kicker">ROUND III · GAME 01</p>
        <h1>DẤU CHÂN<br/>KINH ĐÔ</h1>
        <div className="round3-character-frame">
          {a&&visible&&<button ref={characterRef} className={`round3-active-character ${drag||status==='correct'?'is-drag-source-hidden':''} ${handoff==='enter'?'is-entering':''}`} style={characterStyle} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label={`Kéo ${a.name} đến địa danh tương ứng`}>
            <img src={a.image} alt={a.name}/>
          </button>}
        </div>
        <div className="round3-character-copy">
          <strong>{a?.name}</strong>
          <span>DẤU CHÂN {done.length} / 5</span>
          <p>Kéo nhân vật đến đúng kinh đô trên bản đồ.</p>
        </div>
      </aside>
      <main className="round3-map-panel">
        <header className="round3-game1-header"><p>NHỮNG DẤU CHÂN TẠO NÊN BẢN ĐỒ ĐẠI VIỆT</p><h2>TÌM DẤU CHÂN</h2></header>
        <div className="round3-map-stage" ref={mapStage}>
          <img className="round3-map-image" src={mapArtwork} alt="Bản đồ Việt Nam với năm địa danh lịch sử" draggable={false}/>
          {a&&visible&&(drag||status==='correct')&&<button ref={dragLayerRef} className={`round3-drag-layer ${status==='correct'?'is-correct':''}`} style={characterStyle} aria-hidden="true" tabIndex={-1}>
            <img src={a.image} alt="" draggable={false}/>
          </button>}
          {ids.map((id,index)=>{const p=ROUND3_LOCATIONS[id];return <div key={id} ref={node=>{locationRefs.current[id]=node}} className={`round3-location ${done.includes(id)?'is-completed':''} ${completionLit>=index?'is-final-lit':''} ${wrongLocation===id?'is-wrong':''} ${nearestLocation===id?'is-drop-active':''}`} style={{left:`${p.x}%`,top:`${p.y}%`} as CSSProperties}>
            <div className="round3-drop-zone"/><i className="round3-marker-dot">{done.includes(id)&&<b>✓</b>}</i><span className="round3-location-label" style={{'--label-x':`${p.labelX}px`,'--label-y':`${p.labelY}px`} as CSSProperties}>{p.label}</span>
          </div>})}
        </div>
      </main>
    </div>
    {drag&&<div ref={indicatorRef} className="round3-drag-indicator" aria-hidden="true"/>}
    {wrongLocation!==null&&<div className="round3-feedback">Dấu chân này chưa đúng vị trí.</div>}
    {status==='completed'&&<div className={`round3-game1-outro outro-${outro}`} aria-live="polite">
      <div className="round3-game1-outro-shade"/>
      <div className="round3-game1-outro-message"><b>NĂM DẤU CHÂN</b><strong>MỘT DÒNG LỊCH SỬ</strong><span>Những dấu chân đã hội tụ, mở lối cho dòng chảy thời gian.</span></div>
    </div>}
    {(status==='opening'||status==='opening-exit')&&<div className="round3-game1-opening-panel"><div className="round3-game1-opening-inner"><p>ROUND III</p><h1>DẤU CHÂN KINH ĐÔ</h1><b>Những dấu chân tạo nên bản đồ Đại Việt</b><button className="game-button" onClick={startGame}>BẮT ĐẦU HÀNH TRÌNH</button></div></div>}
  </section>;
}

export function RoundThreeGameOneCompleteScene(){
  return null;
}
