// ---- エンティティ関連の関数 ---------------------------------------------

// （ここに何かが入る）
function updatePosition(entity){
  entity.x += entity.vx;
  entity.y += entity.vy;
}

//プレイヤ
function createPlayer(){
  return {x: 200, y: 300, vx: 0, vy: 0};
  //詳しくは連想配列
}

function applyGravity(entity){
  //entity.y += 1;
  entity.vy += 0.15;
}

function drawPlayer(entity){
  noStroke();
  fill('#ffb677');
  square(entity.x, entity.y, 40);  
}

function applyJump(entity){
  entity.vy = -5;
}

function applyJumpRelease(entity){
  entity.vy = 0;
}

//ブロック
function createBlock(y){
  return {x: 900, y, vx: -2, vy: 0};
}

function drawBlock(entity){
  noStroke();
  fill('#5f6caf');
  rect(entity.x, entity.y, 80, 400);
}

function addBlockPair(){
  let y = random(-100, 100);
  blocks.push(createBlock(y));
  blocks.push(createBlock(y + 600));
}


function blockIsAlive(entity){
  return -100 < entity.x;
}

function playerIsAlive(entity){
  return entity.y < 600;
}

//** 初期化 */
function resetGame(){
  
  gameState = 'play';
  
    // プレイヤーを作成
  player = createPlayer();
  
  //ブロックを作成
  //block = createBlock();
  
  blocks = [];
  
}

//** 更新 */
function updateGame(){
  
  //ゲームオーバーの時は更新しない
  if(gameState === 'gameover'){
    return;
  }   
  
  //ブロックの追加と削除
  if(frameCount % 120 === 1) addBlockPair(blocks);
  blocks = blocks.filter(blockIsAlive);
  
  // プレイヤーの位置を更新
  updatePosition(player);
  //ブロックの位置
  //updatePosition(block);
  for(let block of blocks){
    updatePosition(block);
  }
  
  // プレイヤーに重力を適用
  applyGravity(player);
  
  //プレイヤーが死んだらゲームオーバー
  if(!playerIsAlive(player)){
    gameState = 'gameover';
  }
  
  // 衝突判定
  for (let block of blocks) {
    if (entitiesAreColliding(player, block, 20 + 40, 20 + 200)) {
      gameState = "gameover";
      break;
    }
  }
}


function drawGameoverScreen(){
  background(0, 100);
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2);
}

//** 描画 */
function drawGame(){
    // プレイヤーを描画
  background('#edf7fa');
  drawPlayer(player);
  //drawBlock(block);
  for(let block of blocks) drawBlock(block);

  //ゲームオーバーの描画
  if(gameState === 'gameover') drawGameoverScreen();
}

//** マウス関連 *// 
function onMousePress(){
    // プレイヤーをジャンプさせる
    switch(gameState){
      case 'play':
        applyJump(player);
        break;
      case 'gameover':
        resetGame();
        break;
  }
}

function onMouseDragged(entity){
  let x = mouseX;
  let y = mouseY;
  entity.x = x;
  entity.y = y;
  
}

function onMouseRelease(){
    applyJumpRelease(player);
}

// ---- ゲーム全体に関わる部分 ---------------------------------------------

/** プレイヤーエンティティ */
let player;

/** ブロックエンティティ */
//let block;

let blocks;


let gameState;

/**
 * 2つのエンティティが衝突しているかどうかをチェックする
 *
 * @param entityA 衝突しているかどうかを確認したいエンティティ
 * @param entityB 同上
 * @param collisionXDistance 衝突しないギリギリのx距離
 * @param collisionYDistance 衝突しないギリギリのy距離
 * @returns 衝突していたら `true` そうでなければ `false` を返す
 */
function entitiesAreColliding(
  entityA,
  entityB,
  collisionXDistance,
  collisionYDistance
) {
  // xとy、いずれかの距離が十分開いていたら、衝突していないので false を返す

  let currentXDistance = abs(entityA.x - entityB.x); // 現在のx距離
  if (collisionXDistance <= currentXDistance) return false;

  let currentYDistance = abs(entityA.y - entityB.y); // 現在のy距離
  if (collisionYDistance <= currentYDistance) return false;

  return true; // ここまで来たら、x方向でもy方向でも重なっているので true
}
// ---- setup/draw 他 --------------------------------------------------

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);

  resetGame();
}

function draw() {
  updateGame();
  drawGame();
}

function mousePressed() {
  onMousePress();
}

function mouseDragged(){
  //onMouseDragged(player);  
}
function mouseReleased(){
  //onMouseRelease();
}