import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { Chess } from 'chess.js';

const html=await readFile('src/index.html','utf8');
const app=await readFile('src/app.js','utf8');
for(const [name,text] of [['HTML',html],['copy',app]])assert(!text.includes('\u2014'),`Long dash in ${name}`);
for(const match of html.matchAll(/(?:src|href)="(\.\/(?:photos|pieces|fonts)\/[^"#]+)"/g))await access('dist/'+match[1].slice(2));
for(const color of ['w','b'])for(const piece of ['p','r','n','b','q','k'])await access(`dist/pieces/${color}${piece}.svg`);
assert(app.includes('UCI_LimitStrength value true')&&app.includes('UCI_Elo value 1320'));
assert(html.includes('yerzhanuly.y@nisa.edu.kz'));

const engine=spawn(process.execPath,['node_modules/stockfish/src/stockfish-17.1-lite-single-03e3232.js']);
let output='';
let stderr='';engine.stderr.on('data',data=>stderr+=data);
engine.stdout.on('data',data=>output+=data);
const waitFor=async(pattern)=>{
  const deadline=Date.now()+15000;
  while(Date.now()<deadline){if(pattern.test(output))return;await new Promise(resolve=>setTimeout(resolve,40));}
  throw new Error(`Stockfish did not reach ${pattern}. ${stderr}`);
};
const send=command=>engine.stdin.write(command+'\n');
try{
  send('uci');await waitFor(/uciok/);
  assert.match(output,/option name UCI_Elo type spin default \d+ min 1320/);
  send('setoption name UCI_LimitStrength value true');send('setoption name UCI_Elo value 1320');send('isready');await waitFor(/readyok/);
  const game=new Chess();game.move('e4');
  for(let turn=0;turn<3;turn++){
    output='';send(`position fen ${game.fen()}`);send('go movetime 300');await waitFor(/bestmove [a-h][1-8][a-h][1-8]/);
    const move=output.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/)[1];
    assert(game.move({from:move.slice(0,2),to:move.slice(2,4),promotion:move[4]||'q'}),'Engine returned an illegal move');
    if(turn<2)game.move(game.moves()[0]);
  }
  const restored=new Chess();restored.loadPgn(game.pgn());assert.equal(restored.fen(),game.fen());
  console.log('PASS: real Stockfish WASM handshake, native Elo limit, 3 legal replies and PGN restore.');
}finally{engine.kill();}

const promotion=new Chess('7k/P7/8/8/8/8/8/7K w - - 0 1');
assert.equal(promotion.moves({square:'a7',verbose:true}).filter(move=>move.to==='a8').length,4);
promotion.move({from:'a7',to:'a8',promotion:'n'});assert.equal(promotion.get('a8').type,'n');
const mate=new Chess();['f3','e5','g4','Qh4#'].forEach(move=>mate.move(move));assert(mate.isCheckmate());
const stale=new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');assert(stale.isStalemate());
console.log('PASS: promotion choices, checkmate and stalemate rules; all local image and font references.');
console.log('Mail transport requires a live network response and recipient activation; not certified by this check.');
