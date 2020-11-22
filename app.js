const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));

const nextPieceGrid = document.querySelector('.nextPieceGrid');
let nextPieceSquares = Array.from(document.querySelectorAll('.nextPieceGrid div'));

const ScoreDisplay = document.querySelector('#score');
const StartBtn = document.querySelector('#start-button');
const levelDisplay = document.querySelector('#level');


const width = 10;
let score = 0;
let totalTetrominosPlayed = 0;
let level = 1;
let dropSpeed = 1000;
let timerId = setInterval(moveDown, dropSpeed);



//this is the straight tetromino
const sTetromino = [
   [0,width, width*2, width*3],
   [width,width+1, width+2,width+3],
   [0,width, width*2, width*3],
   [width,width+1, width+2,width+3]
  
];

//this is the square shaped tetromino
const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
];


//should be correct
const tTetromino = [
    [1,width, width+1,width+2],
    [0,width,width*2,width+1],
    [width, width+1, width+2, width*2+1],
    [1,width,width+1,width*2+1]
];

//this tetromino is shaped like an upper case L
const lTetromino = [
    [0,1,width, width*2],
    [width,width+1, width+2, width*2+2],
    [1, width+1, width*2, width*2+1],
    [width, width*2, width*2+1, width*2+2]
];

const zTetromino = [
    [0,width,width+1, width*2+1],
    [width+1,width+2, width*2, width*2+1],
    [0,width,width+1, width*2+1],
    [width+1,width+2, width*2, width*2+1]
];


const allTetrominoes = [sTetromino, oTetromino, tTetromino, lTetromino, zTetromino];

let currentPosition = 5;
let random = Math.floor(Math.random()*allTetrominoes.length);
let current = allTetrominoes[random][0];
let randomNext = Math.floor(Math.random()*allTetrominoes.length);
let nextPiece = allTetrominoes[randomNext][0];


function createNewPiece(){
    currentPosition = 5;
    current = nextPiece;
    random = randomNext;
    randomNext = Math.floor(Math.random()*allTetrominoes.length);
    nextPiece = allTetrominoes[randomNext][0];
}

function draw(){
    current.forEach(index =>{
        squares[currentPosition + index].classList.add('tetromino');
    });
}
function drawNextPiece(){
    nextPiece.forEach(index =>{
        nextPieceSquares[index].classList.add('next');
    });
}
function undrawNextPiece(){
    nextPiece.forEach(index => {
        nextPieceSquares[index].classList.remove('next');
    });
}

function stickPiece(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('block');
    });
}

function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
    });
}

draw();
drawNextPiece();


//move down function
function moveDown(){
    if(!checkHit()){
        movePiece(width);
    }else{
        checkForScore();
        totalTetrominosPlayed++;
        if(totalTetrominosPlayed === 15){
            dropSpeed = dropSpeed * (7/10);
            totalTetrominosPlayed = 0;
            level++;
            levelDisplay.innerHTML = level;
        }
    }
}


function checkHitPiece(input){   
    //finds the actual spot of the tetromino
    let actualSpot = current.map(x => x + currentPosition);
    
    let futureSpot = actualSpot.map(x=> x + width);
    //i need to find if the future spot has the classname of block at any spot.
    for(let i =0; i< actualSpot.length; i++){
             if(squares[futureSpot[i]].className === input){
             return true;
         }
     }
}

function restartTimer(){
    timerId = setInterval(moveDown, dropSpeed);
}

//potentially refactor this so that it just checks for hit and
//then 
function checkHit(){
     if(currentPosition + width > 190 || checkHitPiece("end") || checkHitPiece("block")){
        undraw();
        undrawNextPiece();
        clearInterval(timerId);
        stickPiece();
        checkForScore();
        createNewPiece();
        draw();
        drawNextPiece();
        restartTimer();
        return true;
    }        
}


document.addEventListener('keydown', event =>{
    if(event.code === "KeyZ"){
        //finds which rotation the current tetromino
        let currentRotation = allTetrominoes[random].findIndex((element, index) =>{
            for(let i =0; i<element.length; i++){
              //  console.log(`${element[i]} is being compared to ${current[i]}`);
                if(element[i] !== current[i]){
                    return false;
                }
            }
            return true;
        });
        console.log(currentRotation);
        
        let nextRotation = allTetrominoes[random][(currentRotation + 1) % 4]
        let currentWidth =[...new Set(current.map(x => x % width))].length;
        let nextWidth = [...new Set(nextRotation.map(x => x % width))].length;
    
        if(canRotate(nextRotation)){
            undraw();
            current = allTetrominoes[random][(currentRotation + 1) % 4];
            draw();
        }
    }
    if(event.code === "ArrowRight"){
        let currentWidth = [...new Set(current.map(x => x % width))].length;
        if((currentPosition % width) + currentWidth - 1 !== 9){
            if(checkForLegalLateralMove("right")){
                movePiece(1);
            }
        }
    }
    if(event.code === "ArrowLeft"){
        if(currentPosition % width !== 0){
            if(checkForLegalLateralMove("left")){
                movePiece(-1);
            }
            
        }
    }

    if(event.code === "ArrowUp"){
       movePiece(-width);
    }

    if(event.code === "ArrowDown"){
       if(!checkHit()){
           movePiece(width);
       }
    }
});


function movePiece(increment){
    undraw();
    currentPosition = currentPosition + increment;
    draw();
}

function canRotate(nextRotation){
    let currentPositionArray = current.map(x=> (x + currentPosition) % 10);
    let actualNextRotation = nextRotation.map(x => (x + currentPosition) % 10);
  
    let actualSpot = current.map(x=> x + currentPosition);
    let futureSpot = nextRotation.map(x => x + currentPosition);
   

    if(actualNextRotation.filter(x => x < 3).length > 0
    && currentPositionArray.filter(x => x > 5 ).length > 0 ){
         return false;
    }
    for(let i =0; i<futureSpot.length; i++){
        if(squares[futureSpot[i]].className === "block"){
            return false;
        }
    }
     return true;   
}

//this is super similar to check hit other piece
function checkForLegalLateralMove(direction){
    //finds the actual spot of the tetromino
     let actualSpot = current.map(x=> x + currentPosition);
     //finds the spot of the tetromino if it moves forward or backwards one square
     let futureSpot = actualSpot.map(x=> x+1);
    if(direction === "left"){
        futureSpot = actualSpot.map(x=> x-1);
    }
 
  //i need to find if the future spot has the classname of block at any spot.
  for(let i =0; i<futureSpot.length; i++){
      if(squares[futureSpot[i]].className === "block"){
          return false;
      }
  }
  return true;
}


function checkForScore(){
    let total;
    for(let i = 0; i < squares.length/width; i++){
        total = 0;
        for(let j = 0; j <width; j++){
          if(squares[i*width + j].className === "block"){
            total++;
          }if(total === 10){
              removeRow(i);
              adjustBlockRows(i);
              score += 100;
              ScoreDisplay.innerHTML = score;
              
          }
        }   
    }
}

// find where all of the blocks are on the squares array then map thru and add 10 to every 'block'
function removeRow(row){
    for(let i = 0; i<width; i++){
        squares[row*width + i].classList.remove('block');
    }
}

function adjustBlockRows(row){
    let indexArray = [];
    let aboveLineArray = [];

    //blockArray is potentially useless as a variable
    let blockArray = squares.filter((x, index) => {
        if(x.className === 'block'){
           indexArray.push(index);
        } 
       return x.className === 'block';
    });

    aboveLineArray = indexArray.filter(x => x < row * width);
    
   

    indexArray.forEach(index => {
         squares[index].classList.remove('block');
     });
    
    indexArray = indexArray.filter(x => x > (row * width) );

    aboveLineArray = aboveLineArray.map(x => x + width);


     let finalArray = indexArray.concat(aboveLineArray);

    finalArray.forEach(index => {
          squares[index].classList.add('block');
    });
      
}

function endGame(){

}