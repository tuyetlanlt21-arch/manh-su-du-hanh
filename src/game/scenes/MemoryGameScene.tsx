import { useEffect, useRef, useState, type DragEvent } from "react";
import { useGame } from "../GameContext";
import { BackButton } from "../components/BackButton";
import bg from "../../assets/round2/memories/round2-memory-bg.png";
import lac from "../../assets/round2/memories/cards/memory-lac-hong.png";
import mi from "../../assets/round2/memories/cards/memory-mi-nuong.png";
import phu from "../../assets/round2/memories/cards/memory-phu-dong.png";
import loa from "../../assets/round2/memories/cards/memory-co-loa.png";
import mapArt from "../../assets/round2/coloa/round2-co-loa-map.png";
type Id = "lac" | "mi" | "phu" | "loa";
type Marker = "wall" | "gate" | "moat" | "village";
type Phase =
  | "MEMORY_PLAYING"
  | "MEMORY_WRONG"
  | "MEMORY_COMPLETE"
  | "COLOA_MEMORY_RESTORED"
  | "MEMORY_BLACK"
  | "COLOA_INTERSTITIAL_ENTER"
  | "COLOA_INTERSTITIAL_READY"
  | "COLOA_MAP_ENTERING"
  | "COLOA_PLAYING"
  | "COLOA_WRONG"
  | "COLOA_CORRECT";
const pieces = [
    {
      id: "lac" as Id,
      img: lac,
      title: "Nguồn cội Lạc Hồng",
      copy: "Khởi nguồn của giống nòi Lạc Hồng.",
    },
    {
      id: "mi" as Id,
      img: mi,
      title: "Mối duyên Mị Nương",
      copy: "Một mối duyên mở ra dấu ấn Âu Lạc.",
    },
    {
      id: "phu" as Id,
      img: phu,
      title: "Người anh hùng Phù Đổng",
      copy: "Sức mạnh tuổi trẻ bảo vệ non sông.",
    },
    {
      id: "loa" as Id,
      img: loa,
      title: "Sự tích thành Cổ Loa",
      copy: "Những vòng thành gìn giữ kinh đô.",
    },
  ],
  answer: Id[] = ["lac", "mi", "phu", "loa"];
const legacyMarkers = [
  { id: "wall" as Marker, x: 0.72, y: 0.68, label: "VÒNG THÀNH" },
  { id: "gate" as Marker, x: 0.536, y: 0.632, label: "CỔNG THÀNH" },
  { id: "moat" as Marker, x: 0.574, y: 0.736, label: "HÀO NƯỚC" },
  { id: "village" as Marker, x: 0.613, y: 0.858, label: "KHU DÂN CƯ" },
];
const markers = [
  { id: "wall" as Marker, x: 0.536, y: 0.632, label: "VÒNG THÀNH" },
  { id: "gate" as Marker, x: 0.472, y: 0.653, label: "CỔNG THÀNH" },
  { id: "moat" as Marker, x: 0.574, y: 0.736, label: "HÀO NƯỚC" },
  { id: "village" as Marker, x: 0.17, y: 0.27, label: "KHU DÂN CƯ" },
];
const paths = {
  outer: [
    "M403 360 C490 277 620 241 734 240 C902 236 1080 281 1216 337 C1280 365 1323 402 1352 441",
    "M1355 460 C1396 520 1390 580 1345 638 C1308 688 1240 716 1168 731",
    "M1100 735 C980 750 846 724 730 694 C630 669 530 636 470 582",
    "M430 542 C390 487 382 421 403 360",
  ],
  middle: [
    "M500 385 C544 345 604 318 671 303 C760 285 859 296 935 321 C1008 345 1072 382 1115 431",
    "M1110 446 C1140 495 1120 538 1068 570",
    "M1015 584 C920 614 823 621 730 602 C650 585 578 548 534 500",
    "M524 480 C495 443 489 412 500 385",
  ],
  inner: [
    "M657 432 C717 399 797 390 864 406 C925 422 971 455 995 492",
    "M998 508 C1008 545 972 568 925 582",
    "M887 591 C818 604 751 592 700 565",
    "M681 548 C650 520 645 468 657 432",
  ],
};
export function MemoryGameScene() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<Phase>("MEMORY_PLAYING"),
    [slots, setSlots] = useState<(Id | null)[]>([null, null, null, null]),
    [source, setSource] = useState<Id[]>(["phu", "lac", "loa", "mi"]),
    [drag, setDrag] = useState<Id | null>(null),
    [over, setOver] = useState<number | null>(null),
    [feedback, setFeedback] = useState(""),
    [step, setStep] = useState(0),
    [link, setLink] = useState(0),
    [message, setMessage] = useState(false),
    [wall, setWall] = useState(0),
    [selected, setSelected] = useState<Marker | null>(null),
    [success, setSuccess] = useState(false);
  const timers = useRef<number[]>([]),
    started = useRef(false);
  const later = (fn: () => void, n: number) =>
    timers.current.push(window.setTimeout(fn, n));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const item = (id: Id) => pieces.find((p) => p.id === id)!;
  const begin = (event: DragEvent<HTMLButtonElement>, id: Id) => {
    if (phase !== "MEMORY_PLAYING") return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
    setDrag(id);
  };
  const end = () => { setDrag(null); setOver(null); };
  const place = (n: number, memory = drag) => {
    if (!memory || phase !== "MEMORY_PLAYING") return;
    const old = slots[n];
    setSlots((s) => {
      const next = s.map((x) => (x === memory ? null : x));
      next[n] = memory;
      return next;
    });
    setSource((s) => [...s.filter((x) => x !== memory), ...(old ? [old] : [])]);
    end();
  };
  const drop = (event: DragEvent<HTMLDivElement>, slot: number) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") as Id;
    if (id && pieces.some(piece => piece.id === id)) place(slot, id);
  };
  const confirm = () => {
    if (slots.some((x) => !x) || phase !== "MEMORY_PLAYING") return;
    if (slots.every((x, i) => x === answer[i])) {
      setPhase("MEMORY_COMPLETE");
      later(() => setStep(1), 180);
      later(() => setLink(1), 520);
      later(() => setStep(2), 780);
      later(() => setLink(2), 1120);
      later(() => setStep(3), 1380);
      later(() => setLink(3), 1720);
      later(() => setStep(4), 1980);
      later(() => setPhase("COLOA_MEMORY_RESTORED"), 2700);
      later(() => setMessage(true), 3500);
      later(() => setMessage(false), 5100);
      later(() => setPhase("COLOA_INTERSTITIAL_ENTER"), 5450);
      later(() => setPhase("COLOA_INTERSTITIAL_READY"), 6330);
    } else {
      setFeedback("Dòng ký ức vẫn chưa liền mạch...");
      setPhase("MEMORY_WRONG");
      later(() => {
        setFeedback("");
        setPhase("MEMORY_PLAYING");
      }, 1650);
    }
  };
  const choose = (id: Marker | "wall") => {
    if (phase !== "COLOA_PLAYING" || started.current) return;
    if (id !== "wall") {
      setSelected(id);
      setFeedback("Dấu vết này chưa khớp.");
      setPhase("COLOA_WRONG");
      later(() => {
        setSelected(null);
        setFeedback("");
        setPhase("COLOA_PLAYING");
      }, 1450);
      return;
    }
    started.current = true;
    setPhase("COLOA_CORRECT");
    later(() => setWall(1), 250);
    later(() => setSuccess(true), 320);
    later(() => setWall(2), 900);
    later(() => setWall(3), 1650);
    later(() => dispatch({ type: "COMPLETE_ROUND_TWO" }), 4050);
  };
  const inter = phase === "COLOA_MEMORY_RESTORED" || phase === "COLOA_INTERSTITIAL_ENTER" || phase === "COLOA_INTERSTITIAL_READY",
    map =
      phase === "COLOA_MAP_ENTERING" ||
      phase === "COLOA_PLAYING" ||
      phase === "COLOA_WRONG" ||
      phase === "COLOA_CORRECT";
  const debug =
    import.meta.env.DEV &&
    new URLSearchParams(location.search).get("debug-coloa-markers") === "true";
  return (
    <section
      className={
        "round2-chapter phase-" +
        phase +
        " wall-level-" +
        wall +
        " success-copy-" +
        (success ? "on" : "off") +
        " memory-step-" +
        step +
        " memory-link-" +
        link +
        " memory-message-" +
        (message ? "on" : "off")
      }
    >
      <BackButton
        onClick={() =>
          phase === "MEMORY_PLAYING" && dispatch({ type: "RETURN_TO_CHAPTER" })
        }
      />
      <div className="round2-dust" />
      <div className="memory-world" style={{ backgroundImage: `url(${bg})` }} />
      <section className="memory-chapter" aria-hidden={inter || map}>
        <header className="round2-title">
          <p>ROUND II</p>
          <h1>XẾP LẠI KÝ ỨC</h1>
          <span>Khôi phục dòng ký ức đã thất lạc.</span>
        </header>
        <div className="memory-composition memory-placement-game">
          <section className="memory-source">
            <b>CÁC MẢNH KÝ ỨC <small>{slots.filter(Boolean).length} / 4</small></b>
            <div>
              {source.filter((id, index, all) => all.indexOf(id) === index && pieces.some(piece => piece.id === id)).map((id) => (
                <button
                  key={id}
                  className={
                    "memory-piece " + (drag === id ? "is-dragged" : "")
                  }
                  draggable={phase === "MEMORY_PLAYING"}
                  onDragStart={(event) => begin(event, id)}
                  onDragEnd={end}
                >
                  <img src={item(id).img} alt="" draggable={false} />
                  <span>{item(id).title}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="memory-sequence">
            {slots.map((id, n) => (
              <div className="memory-stage" key={n}>
                <div className={"timeline-stop " + (n < step ? "lit" : "")}>
                  <b>0{n + 1}</b>
                </div>
                <div
                  className={
                    "memory-slot " +
                    (over === n ? "is-over " : "") +
                    (id ? "is-filled " : "") +
                    (n < step ? "is-restored " : "") +
                    (n === step - 1 ? "is-restoring" : "")
                  }
                  onDragOver={(event) => { event.preventDefault(); if (drag) setOver(n); }}
                  onDragLeave={() => setOver(null)}
                  onDrop={(event) => drop(event, n)}
                >
                  {id ? (
                    <button
                      className={
                        "memory-piece slot-piece " +
                        (drag === id ? "is-dragged" : "")
                      }
                      draggable={phase === "MEMORY_PLAYING"}
                      onDragStart={(event) => begin(event, id)}
                      onDragEnd={end}
                    >
                      <div className="placed-memory-art"><img src={item(id).img} alt="" draggable={false} /></div>
                      <div className="placed-memory-story"><b>{item(id).title}</b><i/><em>{item(id).copy}</em></div>
                    </button>
                  ) : (
                    <span>THẢ MẢNH KÝ ỨC</span>
                  )}
                </div>
                {n < 3 && (
                  <div
                    className={
                      "timeline-connector " + (n < link ? "energy-link" : "")
                    }
                  >
                    <i />
                  </div>
                )}
              </div>
            ))}
          </section>
          <div className="memory-status memory-restored-message">
            <b>{message ? "DÒNG KÝ ỨC ĐÃ ĐƯỢC KHÔI PHỤC" : feedback}</b>
          </div>
          {phase === "MEMORY_BLACK" && <div className="memory-blackout" aria-hidden={!message}><div className={message ? "memory-black-copy is-visible" : "memory-black-copy"}><b>DÒNG KÝ ỨC</b><strong>ĐÃ ĐƯỢC KHÔI PHỤC</strong><span>Những mảnh ký ức đã trở về đúng vị trí.</span></div></div>}
          <button
            className="game-button memory-confirm"
            disabled={phase !== "MEMORY_PLAYING" || slots.some((x) => !x)}
            onClick={confirm}
          >
            XÁC NHẬN KÝ ỨC
          </button>
        </div>
      </section>
      <section className="coloa-interstitial" aria-hidden={!inter}>
        <div className={'interstitial-copy '+(phase === 'COLOA_MEMORY_RESTORED' ? 'memory-restored-copy' : '')}>
          <p>MẢNH KÝ ỨC II</p>
          <h1>GIẢI MÃ CỔ LOA</h1>
          <span>Ký ức cuối cùng dẫn đến một thành trì cổ xưa.</span>
          <button
            className="coloa-start"
            disabled={phase !== "COLOA_INTERSTITIAL_READY"}
            onClick={() => {
              setPhase("COLOA_MAP_ENTERING");
              later(() => setPhase("COLOA_PLAYING"), 1080);
            }}
          >
            BẮT ĐẦU GIẢI MÃ
          </button>
        </div>
      </section>
      <section className="coloa-world" aria-hidden={!map}>
        <div className="coloa-map-viewport">
          <div className="coloa-map-canvas">
            <img
              className="coloa-map-art"
              src={mapArt}
              alt="Bản đồ thành Cổ Loa"
            />
            <svg
              className="wall-segment-trace"
              viewBox="0 0 1536 1024"
              aria-hidden="true"
            >
              {Object.entries(paths).map(([g, ps]) => (
                <g className={"wall-group " + g} key={g}>
                  {ps.map((d) => (
                    <g className="wall-segment" key={d}>
                      <path className="wall-glow" pathLength="1" d={d} />
                      <path className="wall-core" pathLength="1" d={d} />
                    </g>
                  ))}
                </g>
              ))}
            </svg>
            <div className={"marker-overlay " + (debug ? "marker-debug" : "")}>
              {markers.map((m) => (
                <button
                  key={m.id}
                  disabled={phase !== "COLOA_PLAYING"}
                  onClick={() => choose(m.id)}
                  className={
                    "map-marker " + (selected === m.id ? "is-selected" : "")
                  }
                  style={
                    {
                      left: `${m.x * 100}%`,
                      top: `${m.y * 100}%`,
                    } as React.CSSProperties
                  }
                  aria-label={m.label}
                >
                  <i />
                  <span className="marker-pulse" />
                  <em className="marker-tooltip">{m.label}</em>
                  {debug && (
                    <small>
                      {m.label}
                      <br />
                      x:{m.x} y:{m.y}
                    </small>
                  )}
                </button>
              ))}
              <button
                className="wall-answer-target"
                disabled={phase !== "COLOA_PLAYING"}
                onClick={() => choose("wall")}
                aria-label="Vòng thành"
                style={{ left: "72%", top: "68%" }}
              />
            </div>
          </div>
        </div>
        <div className="map-fog" />
        <div className="coloa-vignette" />
        <aside className="coloa-clue">
          <b>MANH MỐI</b>
          <p>
            “Bộ phận được dựng theo cấu trúc dạng xoáy trôn ốc, dùng để bao che
            không gian bên trong hoặc chống đỡ tiến công của địch.”
          </p>
          <strong>Hãy chọn vị trí tương ứng trên Cổ Loa.</strong>
        </aside>
        {phase === "COLOA_WRONG" && (
          <div className="marker-feedback">{feedback}</div>
        )}
        {success && (
          <div className="wall-answer">
            <b>CHÍNH XÁC</b>
            <strong>VÒNG THÀNH CỔ LOA</strong>
          </div>
        )}
      </section>
    </section>
  );
}
