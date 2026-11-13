import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chess } from 'chess.js';
import { mountDataRain } from './data-rain.ts';
gsap.registerPlugin(ScrollTrigger);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const reduceMotion = () => motionPreference.matches;
let motionPaused = false;
let depthContext = null;
const tiltSurfaces = [$('.hero-album'), $('.calendar-wrap')];
const atmosphere = mountDataRain($('#ambient-flow'), { count: innerWidth < 760 ? 100 : 280, flowSpeed: .28, obstacleRadius: 95, autopilot: false, fullscreen: true, palette: { calm:'#a19890', mid:'#bc929e', hot:'#984258' } });
function syncMotion() {
  document.documentElement.classList.toggle('motion-paused', motionPaused || reduceMotion());
  atmosphere.pause(motionPaused || (unlocked && ['chess','letter'].includes(currentRoute)));
  $('#motion-toggle').setAttribute('aria-pressed',String(motionPaused));
  $('#motion-toggle').setAttribute('aria-label',motionPaused?'Продолжить движение':'Приостановить движение');
  $('#motion-toggle span').textContent=motionPaused?'Продолжить движение':'Пауза движения';
  if(depthContext){depthContext.revert();depthContext=null;}
  if(motionPaused||reduceMotion()){
    gsap.killTweensOf(tiltSurfaces);
    gsap.set(tiltSurfaces,{rotationX:0,rotationY:0});
  }
  positionAlbum(false);
  if(!motionPaused&&!reduceMotion()&&unlocked&&currentRoute==='home')initDepth();
}
$('#motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;syncMotion();});
motionPreference.addEventListener('change',syncMotion);
function initDepth() {
  depthContext=gsap.context(()=>{
    gsap.to('.hero-photo',{y:-34,rotation:1,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.8}});
    gsap.to('.little-photo',{y:-95,rotation:-5,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.scene-photo-family',{y:45,rotation:-14,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.9}});
    gsap.to('.scene-photo-sun',{y:-55,rotation:15,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.fromTo('.fork-lines path',{strokeDasharray:1000,strokeDashoffset:1000},{strokeDashoffset:0,scrollTrigger:{trigger:'.fork-section',start:'top 80%',end:'top 25%',scrub:1},ease:'none'});
    ScrollTrigger.refresh();
  },$('#home-view'));
}
function tiltPaper(element, maxAngle=5) {
  element.addEventListener('pointermove',event=>{
    if(reduceMotion()||motionPaused||event.pointerType!=='mouse')return;
    const rect=element.getBoundingClientRect();
    gsap.to(element,{rotationY:((event.clientX-rect.left)/rect.width-.5)*maxAngle*2,rotationX:-((event.clientY-rect.top)/rect.height-.5)*maxAngle*2,duration:.45,ease:'power2.out',overwrite:'auto'});
  });
  element.addEventListener('pointerleave',()=>{
    if(reduceMotion()||motionPaused){gsap.set(element,{rotationX:0,rotationY:0});return;}
    gsap.to(element,{rotationX:0,rotationY:0,duration:.35,ease:'power3.out'});
  });
}
tiltPaper($('.hero-album'),6);tiltPaper($('.calendar-wrap'),4);
const store = {
  get(key, fallback = '') { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } },
};
const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
months.forEach((month, index) => $('#birth-month').add(new Option(month, String(index + 1), index === 10, index === 10)));
let unlocked = false;
try { unlocked = sessionStorage.getItem('papa-unlocked') === 'yes'; } catch { /* The calendar works without storage. */ }
let selectedDay = 0;
let calendarMonth = 11;

function renderCalendar() {
  const restoreDayFocus = $('#calendar-days').contains(document.activeElement);
  $('#calendar-month').innerHTML = `${months[calendarMonth - 1]} <span>2026</span>`;
  $('#birth-month').value = String(calendarMonth);
  const offset = (new Date(2026, calendarMonth - 1, 1).getDay() + 6) % 7;
  const count = new Date(2026, calendarMonth, 0).getDate();
  $('#calendar-days').replaceChildren();
  for (let i = 0; i < offset; i++) $('#calendar-days').append(document.createElement('span'));
  for (let day = 1; day <= count; day++) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'calendar-day'; button.textContent = day;
    button.setAttribute('aria-label', `${day}, ${months[calendarMonth - 1]}`);
    button.setAttribute('aria-pressed', String(day === selectedDay));
    button.addEventListener('click', () => { selectedDay = day; $('#birth-day').value = String(day).padStart(2, '0'); clearDateError(); renderCalendar(); });
    $('#calendar-days').append(button);
  }
  if(restoreDayFocus)$('#calendar-days [aria-pressed="true"]')?.focus({preventScroll:true});
}
function clearDateError() {
  $('#gate-message').textContent = 'Выбери дату в календаре или введи её.';
  $('#gate-message').classList.remove('error');
  $('#birth-day').removeAttribute('aria-invalid');
}
$('#birth-day').addEventListener('input', (event) => { event.target.value = event.target.value.replace(/\D/g, '').slice(0, 2); selectedDay = Number(event.target.value); clearDateError(); renderCalendar(); });
$('#birth-month').addEventListener('change', (event) => { calendarMonth = Number(event.target.value); clearDateError(); renderCalendar(); });
$('#month-prev').addEventListener('click', () => { calendarMonth = calendarMonth === 1 ? 12 : calendarMonth - 1; clearDateError(); renderCalendar(); });
$('#month-next').addEventListener('click', () => { calendarMonth = calendarMonth === 12 ? 1 : calendarMonth + 1; clearDateError(); renderCalendar(); });
renderCalendar();

const reveals = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    reveals.unobserve(entry.target);
    if (!reduceMotion()&&!motionPaused) gsap.fromTo(entry.target, { y: 24, opacity: .2 }, { y: 0, opacity: 1, duration: .65, ease: 'power3.out', clearProps: 'transform,opacity' });
  }
}, { threshold: .14 });
$$('.reveal').forEach((element) => reveals.observe(element));

function showGift(animate = false) {
  $('#gate').hidden = true;
  $('#gift').hidden = false; $('#gift').inert = false;
  document.body.classList.remove('gate-open');
  renderRoute();
  if (animate && !reduceMotion() && !motionPaused && ['','home'].includes(location.hash.slice(1))) {
    gsap.fromTo('.hero-copy', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', clearProps: 'all' });
    gsap.fromTo('.hero-album', { opacity: 0, y: 42, rotation: -3 }, { opacity: 1, y: 0, rotation: 0, duration: 1, delay: .1, ease: 'power3.out', clearProps: 'all' });
  }
  const title=$(`#${currentRoute==='home'?'hero':currentRoute}-title`);
  title.tabIndex=-1;
  title.focus({preventScroll:true});
}
$('#unlock-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (Number($('#birth-day').value) !== 14 || Number($('#birth-month').value) !== 11) {
    $('#gate-message').textContent = 'Пока не открылось. Подумай о своём дне рождения и попробуй ещё раз.';
    $('#gate-message').classList.add('error'); $('#birth-day').setAttribute('aria-invalid', 'true');
    if (!reduceMotion()&&!motionPaused) gsap.fromTo('.calendar-paper', { x: -7 }, { x: 0, duration: .32, ease: 'elastic.out(1, .25)' });
    return;
  }
  unlocked = true;
  try { sessionStorage.setItem('papa-unlocked', 'yes'); } catch { /* A reload will ask for the date again. */ }
  $('#unlock-button').disabled = true; $('#unlock-button').firstChild.textContent = 'Это твой день ';
  $('#gate-message').textContent = 'Правильно, папа. С днём рождения!';
  if (reduceMotion()||motionPaused) { showGift(); return; }
  document.body.classList.add('gate-open');
  gsap.timeline({ onComplete: () => showGift(true) })
    .to('.lock-shackle', { rotation: -38, x: -3, y: -4, duration: .25, ease: 'power2.out' })
    .to('#falling-lock', { y: 520, x: 80, rotation: 43, opacity: 0, duration: .7, ease: 'power3.in' }, '+=.1')
    .to('#gate', { opacity: 0, y: -16, duration: .25, ease: 'power2.in' }, '-=.14');
});

let currentRoute = 'home';
function navigate(hash) {
  if (location.hash !== hash) history.pushState(null, '', hash);
  renderRoute();
}
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || !unlocked) return;
  event.preventDefault();
  if (link.classList.contains('skip-link')) { $('#main-content').focus(); return; }
  navigate(link.getAttribute('href'));
});
window.addEventListener('popstate', () => { if (unlocked) renderRoute(); });
function renderRoute() {
  const hash = location.hash.slice(1);
  const route = ['wishes','chess','letter'].includes(hash) ? hash : 'home';
  const changed = currentRoute !== route;
  currentRoute = route;
  for (const name of ['home','wishes','chess','letter']) $(`#${name}-view`).hidden = name !== route;
  $$('[data-route]').forEach((link) => { if (link.dataset.route === route) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
  const titles = { home:'Папа, с днём рождения', wishes:'От всего сердца', chess:'Твой ход, папа', letter:'Письмо себе через год' };
  document.title = titles[route] + (route === 'home' ? '' : ' · Для папы');
  if (route === 'chess') startEngine();
  syncMotion();
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (hash === 'fork') requestAnimationFrame(() => $('#fork').scrollIntoView({ behavior: reduceMotion()||motionPaused ? 'instant' : 'smooth' }));
  if (changed && !reduceMotion()&&!motionPaused) gsap.fromTo($(`#${route}-view`), { y: 12, opacity: .3 }, { y: 0, opacity: 1, duration: .28, ease:'power3.out', clearProps:'transform,opacity' });
  if (changed) $(`#${route === 'home' ? 'hero' : route}-title`).setAttribute('tabindex','-1');
  if (changed) $(`#${route === 'home' ? 'hero' : route}-title`).focus({ preventScroll:true });
}

const wishes = [
  { image:'childhood', title:'Спасибо за «я рядом».', text:'Папа, с тобой даже самый обычный день становится хорошим воспоминанием. Спасибо за твою поддержку, терпение и за чувство, что рядом с тобой всё получится.', caption:'С тобой спокойнее. С самого детства.', alt:'Папа и маленький Ерасыл улыбаются на прогулке', position:'center' },
  { image:'home', title:'Пусть дома всегда ждут.', text:'Желаю тебе побольше таких моментов, когда никуда не нужно спешить. Когда рядом свои люди, можно обнять кого-то маленького и просто выдохнуть. Пусть этого тепла хватает на всё.', caption:'Самое важное уже рядом.', alt:'Папа обнимает малыша на диване', position:'center' },
  { image:'care', title:'Береги и себя тоже.', text:'Ты столько внимания отдаёшь нам. Хочется, чтобы в новом году у тебя оставалось время и на себя: на отдых, здоровье, любимые дела и тихие дни без срочных задач.', caption:'Заботы много. Любви ещё больше.', alt:'Папа заботливо сидит рядом с малышом на отдыхе', position:'35% center' },
  { image:'family', title:'Побольше вечеров вместе.', text:'Пусть мы чаще собираемся за одним столом, рассказываем, как прошёл день, и смеёмся над чем-нибудь своим. Иногда счастье выглядит именно так. И ничего больше не нужно.', caption:'Наши обычные, очень хорошие дни.', alt:'Семья вместе за домашним столом', position:'center' },
  { image:'holiday', title:'Новых дорог и тёплого солнца.', text:'Желаю тебе поездок, которых давно хотелось. Красивых мест, вкусных завтраков, моря и дней, когда самый сложный вопрос: куда пойдём сегодня? И чтобы мы были рядом.', caption:'Ещё столько мест, где мы не были.', alt:'Папа в жёлтых шортах стоит на солнечном курорте', position:'center 57%' },
  { image:'fun', title:'Никогда не теряй этот взгляд.', text:'Спасибо, что умеешь быть серьёзным, когда нужно, и смешным, когда мы совсем этого не ждём. Пусть поводов улыбаться будет больше. А таких фотографий у нас и так уже достаточно. Хотя можно ещё.', caption:'Эту фотографию я, конечно, сохранил.', alt:'Весёлая фотография папы в кепке крупным планом', position:'center 38%' },
  { image:'serious', title:'Пусть всё задуманное получится.', text:'Желаю тебе сил на большие планы и удовольствия от маленьких побед. Пусть работа радует, решения находятся, а после сложного дня всегда остаётся повод сказать: сегодня было хорошо.', caption:'Когда точно знаешь, что всё получится.', alt:'Папа на балконе во время семейной поездки', position:'center 33%' },
  { image:'spa', title:'Отдыхать тоже по плану.', text:'Пусть в календаре будет место для дней без будильника. Для хорошего сна, любимой еды и возможности ни за что не отвечать хотя бы несколько часов. Ты это заслужил, папа.', caption:'Папа официально на отдыхе.', alt:'Папа в белом халате во время отдыха', position:'center 40%' },
  { image:'future', title:'Будущее тебе идёт.', text:'Желаю, чтобы тебе всегда было интересно пробовать новое. Новые места, новые идеи, новые увлечения. Пусть впереди будет много вещей, о которых ты скажешь: вот это я хочу попробовать.', caption:'К следующему году готов.', alt:'Папа примеряет большие зеркальные очки', position:'center 30%' },
  { image:'family-trip', title:'Мы тебя очень любим.', text:'За твою заботу, за смех, за помощь и за всё, что не помещается в одно поздравление. Просто будь здоров и счастлив. А мы постараемся чаще говорить, как ты нам дорог. С днём рождения, папа!', caption:'Самый любимый человек нашей семьи.', alt:'Вся семья вместе в отпуске', position:'center 53%' },
];
let wishIndex = 0;
let albumBusy = false;
const albumCards = [];
$('#wish-stack').classList.add('coverflow-stage');
$('#wish-stack').setAttribute('aria-roledescription','карусель');
$('#wish-stack').replaceChildren();
wishes.forEach((wish,index)=>{
  const card=document.createElement('figure');card.className='coverflow-card photo-frame';card.setAttribute('role','group');card.setAttribute('aria-label',`Фотография ${index+1} из ${wishes.length}`);
  const image=document.createElement('img');image.src=`./photos/${wish.image}.webp`;image.alt=wish.alt;image.draggable=false;image.style.objectPosition=wish.position;
  const caption=document.createElement('figcaption');caption.textContent=wish.caption;card.append(image,caption);$('#wish-stack').append(card);albumCards.push(card);
});
function positionAlbum(animate=true){
  const compact=innerWidth<760;
  const spacing=compact?142:165;
  // Same 3D depth/rotation model as VentorMe's coverflow-carousel.tsx.
  albumCards.forEach((card,index)=>{
    const offset=index-wishIndex;const active=offset===0;const visible=Math.abs(offset)<=3;
    card.hidden=!visible;card.inert=!active;card.setAttribute('aria-hidden',String(!active));card.style.zIndex=String(wishes.length-Math.abs(offset));
    const target=reduceMotion()||motionPaused?{x:0,z:0,rotationY:0,rotationZ:0,scale:1,opacity:active?1:0}:{x:offset*spacing,z:-Math.abs(offset)*180,rotationY:-offset*38,rotationZ:active?-2:offset*2,scale:Math.max(1-Math.abs(offset)*.14,.4),opacity:visible?1:0};
    if(animate&&!reduceMotion()&&!motionPaused)gsap.to(card,{...target,duration:.6,ease:'power3.out',overwrite:true});else{gsap.killTweensOf(card);gsap.set(card,target);}
  });
}
window.addEventListener('resize',()=>positionAlbum(false),{passive:true});
wishes.forEach((wish, index) => {
  const button = document.createElement('button');button.type='button';button.className='wish-dot';button.setAttribute('aria-label',`Пожелание ${index + 1}: ${wish.title}`);
  button.addEventListener('click', () => turnWish(index));$('#wish-dots').append(button);
});
function updateWish() {
  const wish = wishes[wishIndex];
  $('#wish-count').textContent = `${wishIndex + 1} / ${wishes.length}`;
  $('#wish-title').textContent = wish.title; $('#wish-body').textContent = wish.text;
  positionAlbum(false);
  $$('.wish-dot').forEach((button,index)=>button.setAttribute('aria-current',String(index===wishIndex)));
  $('#wish-prev').disabled = wishIndex === 0; $('#wish-next').disabled = wishIndex === wishes.length - 1;
  const preload = new Image();if(wishes[wishIndex+1])preload.src=`./photos/${wishes[wishIndex+1].image}.webp`;
}
async function turnWish(next) {
  if (albumBusy || next < 0 || next >= wishes.length || next === wishIndex) return;
  albumBusy=true;
  const image=new Image();image.src=`./photos/${wishes[next].image}.webp`;
  try{await image.decode();}catch{ /* The image element still exposes its alt if an image fails. */ }
  if (reduceMotion()||motionPaused) {wishIndex=next;updateWish();albumBusy=false;return;}
  const oldPositions=albumCards.map(card=>({x:gsap.getProperty(card,'x'),z:gsap.getProperty(card,'z'),rotationY:gsap.getProperty(card,'rotationY'),rotationZ:gsap.getProperty(card,'rotationZ'),scale:gsap.getProperty(card,'scale'),opacity:gsap.getProperty(card,'opacity')}));
  gsap.timeline({onComplete:()=>{albumBusy=false;}})
    .to('#wish-text',{opacity:0,y:-6,duration:.15})
    .call(()=>{wishIndex=next;updateWish();albumCards.forEach((card,index)=>gsap.set(card,oldPositions[index]));positionAlbum(true);})
    .to('#wish-text',{opacity:1,y:0,duration:.3,ease:'power2.out'});
}
$('#wish-prev').addEventListener('click',()=>turnWish(wishIndex-1));$('#wish-next').addEventListener('click',()=>turnWish(wishIndex+1));
let touchStart=null;
$('#wish-stack').addEventListener('touchstart',event=>{const touch=event.changedTouches[0];touchStart={x:touch.clientX,y:touch.clientY};},{passive:true});
$('#wish-stack').addEventListener('touchend',event=>{if(!touchStart)return;const touch=event.changedTouches[0];const x=touch.clientX-touchStart.x,y=touch.clientY-touchStart.y;if(Math.abs(x)>45&&Math.abs(x)>Math.abs(y)*1.2)turnWish(wishIndex+(x<0?1:-1));touchStart=null;},{passive:true});
document.addEventListener('keydown',event=>{if(currentRoute!=='wishes'||!unlocked||event.target.closest('input,textarea,select'))return;if(event.key==='ArrowRight'){event.preventDefault();turnWish(wishIndex+1);}if(event.key==='ArrowLeft'){event.preventDefault();turnWish(wishIndex-1);}});
updateWish();

const game = new Chess();
try{const pgn=store.get('papa-chess-pgn');if(pgn)game.loadPgn(pgn);}catch{game.reset();}
let engine=null,engineReady=false,thinking=false,selectedSquare=null,lastMove=null,pendingFen=null,engineTimer=null;
const pieceNames={p:'пешка',r:'ладья',n:'конь',b:'слон',q:'ферзь',k:'король'};
function saveGame(){store.set('papa-chess-pgn',game.pgn());}
function engineFailure() {
  if(engine)engine.terminate();engine=null;engineReady=false;thinking=false;pendingFen=null;
  clearTimeout(engineTimer);$('#engine-dot').classList.remove('ready');$('#retry-engine').hidden=false;
  renderBoard();$('#game-status').textContent='Соперник не загрузился. Попробуй ещё раз.';
}
function startEngine() {
  if(engine)return;
  $('#retry-engine').hidden=true;$('#game-status').textContent='Загружаем соперника...';
  try{engine=new Worker('./engine/stockfish-17.1-lite-single-03e3232.js');}catch{engineFailure();return;}
  engineTimer=setTimeout(engineFailure,30000);
  engine.onerror=engineFailure;
  engine.onmessage=event=>{
    const lines=String(event.data).split('\n');
    for(const line of lines){
      if(line==='uciok'){
        engine.postMessage('setoption name Hash value 16');
        engine.postMessage('setoption name UCI_LimitStrength value true');
        engine.postMessage('setoption name UCI_Elo value 1320');
        engine.postMessage('ucinewgame');engine.postMessage('isready');
      }
      if(line==='readyok'){
        clearTimeout(engineTimer);engineReady=true;$('#engine-dot').classList.add('ready');renderBoard();
        if(game.turn()==='b'&&!game.isGameOver())requestEngineMove();
      }
      if(line.startsWith('bestmove ')){
        clearTimeout(engineTimer);
        if(!thinking||game.fen()!==pendingFen)return;
        const uci=line.split(' ')[1];thinking=false;pendingFen=null;
        try{const move=game.move({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]||'q'});lastMove=move;saveGame();renderBoard();}catch{engineFailure();}
      }
    }
  };
  engine.postMessage('uci');
}
function requestEngineMove(){
  if(!engineReady||thinking||game.turn()!=='b'||game.isGameOver())return;
  thinking=true;pendingFen=game.fen();renderBoard();
  engineTimer=setTimeout(engineFailure,20000);
  engine.postMessage(`position fen ${pendingFen}`);
  engine.postMessage('go movetime 1100');
}
function resetEngine(){if(engine)engine.terminate();engine=null;engineReady=false;thinking=false;pendingFen=null;clearTimeout(engineTimer);$('#engine-dot').classList.remove('ready');startEngine();}
function gameStatus(){
  if(game.isCheckmate())return game.turn()==='b'?'Мат. Папа победил!':'Мат. Можно сыграть ещё раз.';
  if(game.isStalemate())return 'Пат. Ничья.';
  if(game.isInsufficientMaterial())return 'Ничья: недостаточно фигур.';
  if(game.isThreefoldRepetition())return 'Ничья: повторение позиции.';
  if(game.isDraw())return 'Партия завершилась вничью.';
  if(!engineReady)return 'Загружаем соперника...';
  if(thinking||game.turn()==='b')return 'Соперник думает...';
  return game.isCheck()?'Шах. Защити короля.':'Твой ход, папа';
}
function renderBoard(){
  const board=$('#chessboard');const activeSquare=document.activeElement?.dataset?.square;
  const legal=selectedSquare?game.moves({square:selectedSquare,verbose:true}):[];
  const fragment=document.createDocumentFragment();
  for(let row=0;row<8;row++)for(let col=0;col<8;col++){
    const square=String.fromCharCode(97+col)+(8-row);const piece=game.get(square);
    const button=document.createElement('button');button.type='button';button.className='square'+((row+col)%2?' dark':'');button.dataset.square=square;
    button.tabIndex=square===(activeSquare||'e2')?0:-1;
    button.setAttribute('aria-label',`${square}${piece?`, ${piece.color==='w'?'белые':'чёрные'}, ${pieceNames[piece.type]}`:', пустая клетка'}`);
    if(square===selectedSquare){button.classList.add('selected');button.setAttribute('aria-pressed','true');}
    if(legal.some(move=>move.to===square))button.classList.add('legal');
    if(lastMove&&(lastMove.from===square||lastMove.to===square))button.classList.add('last-move');
    if(piece){button.classList.add('has-piece');const img=document.createElement('img');img.src=`./pieces/${piece.color}${piece.type}.svg`;img.alt='';img.draggable=false;button.append(img);if(piece.type==='k'&&piece.color===game.turn()&&game.isCheck())button.classList.add('check');}
    if(col===0){const coord=document.createElement('span');coord.className='coord rank';coord.textContent=8-row;coord.setAttribute('aria-hidden','true');button.append(coord);}
    if(row===7){const coord=document.createElement('span');coord.className='coord file';coord.textContent=String.fromCharCode(97+col);coord.setAttribute('aria-hidden','true');button.append(coord);}
    button.addEventListener('click',()=>clickSquare(square));fragment.append(button);
  }
  board.replaceChildren(fragment);
  if(activeSquare&&currentRoute==='chess')board.querySelector(`[data-square="${activeSquare}"]`)?.focus({preventScroll:true});
  $('#game-status').textContent=gameStatus();
  $('#undo-move').disabled=thinking||!engineReady||game.history().length===0;
  const history=game.history();$('#move-count').textContent=String(history.length);$('#move-history').replaceChildren();
  if(!history.length)$('#move-history').textContent='Твоя история партии появится здесь.';
  for(let i=0;i<history.length;i+=2){const line=document.createElement('div');line.className='move-pair';for(const label of [`${i/2+1}.`,history[i],history[i+1]||'']){const span=document.createElement('span');span.textContent=label;line.append(span);}$('#move-history').append(line);}
  $('#game-result').hidden=!game.isGameOver();
  if(game.isGameOver())$('#game-result').textContent=game.isCheckmate()?(game.turn()==='b'?'Мат! Папа, победа твоя. За этой доской ты сегодня главный.':'На этот раз соперник оказался сильнее. Реванш? Мы всё равно болеем за тебя.'):'Ничья. Хорошая партия, папа. Попробуем ещё одну?';
}
function clickSquare(square){
  if(!engineReady||thinking||game.turn()!=='w'||game.isGameOver()||!$('#promotion').hidden)return;
  const piece=game.get(square);
  if(selectedSquare){
    const candidates=game.moves({square:selectedSquare,verbose:true}).filter(move=>move.to===square);
    if(candidates.length){
      if(candidates.some(move=>move.promotion)){showPromotion(selectedSquare,square);return;}
      makePlayerMove({from:selectedSquare,to:square});return;
    }
  }
  selectedSquare=piece?.color==='w'&&selectedSquare!==square?square:null;renderBoard();
}
function makePlayerMove(move){
  try{lastMove=game.move(move);}catch{return;}
  selectedSquare=null;saveGame();renderBoard();if(!game.isGameOver())requestEngineMove();
}
function showPromotion(from,to){
  const dialog=$('#promotion');dialog.hidden=false;$('#chessboard').inert=true;$('#promotion-choices').replaceChildren();
  for(const piece of ['q','r','b','n']){const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',pieceNames[piece]);const img=document.createElement('img');img.src=`./pieces/w${piece}.svg`;img.alt='';button.append(img);button.addEventListener('click',()=>{dialog.hidden=true;$('#chessboard').inert=false;makePlayerMove({from,to,promotion:piece});});$('#promotion-choices').append(button);}
  $('#promotion-choices button').focus();
}
$('#promotion').addEventListener('keydown',event=>{const buttons=$$('#promotion-choices button');if(event.key==='Escape'){event.preventDefault();$('#promotion').hidden=true;$('#chessboard').inert=false;selectedSquare=null;renderBoard();$('#chessboard button[tabindex="0"]').focus();}if(event.key==='Tab'){event.preventDefault();const index=buttons.indexOf(document.activeElement);buttons[(index+(event.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}});
$('#chessboard').addEventListener('keydown',event=>{const button=event.target.closest('[data-square]');if(!button)return;const offsets={ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8};if(!(event.key in offsets))return;event.preventDefault();const squares=$$('#chessboard .square');const next=squares[(squares.indexOf(button)+offsets[event.key]+64)%64];button.tabIndex=-1;next.tabIndex=0;next.focus();});
$('#new-game').addEventListener('click',()=>{game.reset();selectedSquare=null;lastMove=null;$('#promotion').hidden=true;$('#chessboard').inert=false;saveGame();resetEngine();renderBoard();});
$('#undo-move').addEventListener('click',()=>{if(thinking)return;game.undo();if(game.turn()==='b')game.undo();selectedSquare=null;lastMove=game.history({verbose:true}).at(-1)||null;saveGame();resetEngine();renderBoard();});
$('#retry-engine').addEventListener('click',startEngine);
renderBoard();

const letter=$('#letter-message');
letter.value=store.get('papa-future-letter');
function updateLetter(){
  $('#letter-length').textContent=letter.value.length.toLocaleString('ru-RU');
  const saved=store.set('papa-future-letter',letter.value);
  $('#letter-save-status').textContent=saved?(letter.value?'Черновик сохранён на этом устройстве':'Черновик сохраняется на этом устройстве'):'Сохранение недоступно. Скачай копию перед уходом.';
  $('#letter-mailto').href=`mailto:yerzhanuly.y@nisa.edu.kz?subject=${encodeURIComponent('Папе. Открыть 14 ноября 2027')}&body=${encodeURIComponent('Письмо от 14 ноября 2026\n\nДорогой я,\n\n'+letter.value+'\n\nС теплом, я.')}`;
}
letter.addEventListener('input',()=>{letter.setCustomValidity('');$('#letter-feedback').hidden=true;updateLetter();});
updateLetter();
$('#letter-download').addEventListener('click',()=>{const blob=new Blob(['Письмо себе. Открыть 14 ноября 2027\n\nДорогой я,\n\n'+letter.value+'\n\nС теплом, я.'],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='papa-letter-14-11-2027.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#letter-form').addEventListener('submit',async event=>{
  event.preventDefault();
  if(letter.value.trim().length<10){letter.setCustomValidity('Напиши хотя бы несколько слов, от 10 символов.');letter.reportValidity();return;}
  if($('#letter-form [name="_honey"]').value)return;
  const button=$('#letter-submit');button.disabled=true;letter.readOnly=true;button.firstChild.textContent='Отправляем письмо ';$('#letter-feedback').hidden=true;$('#letter-fallback').hidden=true;
  try{
    const response=await fetch('https://formsubmit.co/ajax/yerzhanuly.y@nisa.edu.kz',{
      method:'POST',headers:{'Accept':'application/json'},
      body:new URLSearchParams({name:'Папа. Письмо себе через год',message:`Открыть 14 ноября 2027.\nНаписано 14 ноября 2026.\n\nДорогой я,\n\n${letter.value.trim()}\n\nС теплом, я.`,_subject:'Папе. Открыть 14 ноября 2027',_template:'basic',_captcha:'false',_url:location.href.split('#')[0]}),
      signal:AbortSignal.timeout(20000),
    });
    const data=await response.json();
    if(!response.ok||(data.success!==true&&data.success!=='true'))throw new Error('Submission not accepted');
    $('#letter-form').hidden=true;$('#letter-help').hidden=true;$('#sealed-letter').hidden=false;
    if(!reduceMotion()&&!motionPaused)gsap.fromTo('.envelope-visual',{y:20,opacity:0,rotation:-6},{y:0,opacity:1,rotation:0,duration:.6,ease:'power3.out'});
    $('#sealed-letter h2').tabIndex=-1;$('#sealed-letter h2').focus({preventScroll:true});
  }catch{
    $('#letter-feedback').textContent='Не удалось подтвердить отправку. Черновик остался здесь. Попробуй ещё раз или отправь письмо через свою почту.';
    $('#letter-feedback').hidden=false;$('#letter-fallback').hidden=false;
  }finally{button.disabled=false;letter.readOnly=false;button.firstChild.textContent='Запечатать и отправить ';}
});
$('#write-again').addEventListener('click',()=>{$('#sealed-letter').hidden=true;$('#letter-form').hidden=false;$('#letter-help').hidden=false;letter.focus();});
window.addEventListener('pagehide',()=>{clearTimeout(engineTimer);if(engine)engine.terminate();engine=null;engineReady=false;thinking=false;pendingFen=null;});
window.addEventListener('pageshow',event=>{if(event.persisted&&currentRoute==='chess')startEngine();});
if(unlocked)showGift();
