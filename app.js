const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const ScoreDisplay = document.querySelector('#score');
const StartBtn = document.querySelector('#start-button');
const levelDisplay = document.querySelector('#level');


const width = 10;
let score = 0;
let totalTetrominosPlayed = 0;
let level = 1;
let dropSpeed = 10000;



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
//picks random tetromino
let random = Math.floor(Math.random()*allTetrominoes.length);
let current = allTetrominoes[random][0];
console.log(current);


function createNewPiece(){
    currentPosition = 5;
    random = Math.floor(Math.random()*allTetrominoes.length);
    current = allTetrominoes[random][0];
}



function draw(){
    current.forEach(index =>{
        squares[currentPosition + index].classList.add('tetromino');
    });
}

function stickPiece(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('block');
    });
}

//remove the tetrominoes as it moves down the board
function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
    });
}

draw();

//make the tetromino move down every second
timerId = setInterval(moveDown, dropSpeed);

//move down function
function moveDown(){
    if(!checkHit()){
        undraw();
        currentPosition += width;
        draw();
    }else{
        console.log(totalTetrominosPlayed);
        checkForScore();
        createNewPiece();
        totalTetrominosPlayed++;
        if(totalTetrominosPlayed === 15){
            dropSpeed = dropSpeed * (7/10);
            totalTetrominosPlayed = 0;
            level++;
            levelDisplay.innerHTML = level;
        }
        
        draw();
        timerId = setInterval(moveDown, dropSpeed);

    }
}


function checkHitOtherPiece(){
    //finds the actual spot of the tetromino
    let actualSpot = current.map(x=> x + currentPosition);
   //finds the spot of the tetromino if it falls one row
    let futureSpot = actualSpot.map(x=> x + width);
   
    //i need to find if the future spot has the classname of block at any spot.
    for(let i =0; i<futureSpot.length; i++){
        if(squares[futureSpot[i]].className === "block"){
            return true;
        }
    }
}

function checkHit(){
    //checks for hitting the bottom row
    if(currentPosition + width > 190){
        undraw();
        clearInterval(timerId);
        stickPiece();
        return true;
    }
    //checks for hitting other pieces
    if(checkHitOtherPiece()){
        undraw();
        clearInterval(timerId);
        stickPiece();
        return true;
    }
        
}


document.addEventListener('keydown', event =>{
    if(event.code === "KeyZ"){
        //find index of current rotation
        let currentRotation = allTetrominoes[random].findIndex((element, index) =>{
            for(let i =0; i<element.length; i++){
              //  console.log(`${element[i]} is being compared to ${current[i]}`);
                if(element[i] !== current[i]){
                    return false;
                }
            }
            return true;
        });
        
        let nextRotation = allTetrominoes[random][(currentRotation + 1) % 4]
        let currentWidth =[...new Set(current.map(x => x % width))].length;
        let nextWidth = [...new Set(nextRotation.map(x => x % width))].length;
        
        
    //     console.log(`The current 0 position is: ${currentPosition +currentWidth + (nextWidth - currentWidth)}`);
    //     console.log(`The end of row width is: ${(Math.floor(currentPosition/width) * width )+ 9}`);
        
    //    console.log(nextRotation);
    //    console.log(currentWidth);
    //    console.log(nextWidth);
    //    console.log(nextWidth - currentWidth);

    
        if(canRotate(nextRotation)){
            undraw();
            current = allTetrominoes[random][(currentRotation + 1) % 4];
            draw();
        }
    }
    if(event.code === "ArrowRight"){
        let currentWidth = [...new Set(current.map(x => x % width))].length;
        if((currentPosition % width) + currentWidth - 1 !== 9){
          undraw();
          currentPosition += 1;
          draw();
        }
    }
    if(event.code === "ArrowLeft"){
        if(currentPosition % width !== 0){
            undraw();
            currentPosition -= 1;
            draw();
        }
        
    }
    if(event.code === "ArrowUp"){
        undraw();
        currentPosition -= width;
        draw();
    }
    if(event.code === "ArrowDown"){
        checkHit();
        undraw();
        currentPosition += width;
        draw();
    }
});

function canRotate(nextRotation){
    let currentPositionArray = current.map(x=> (x + currentPosition) % 10);
    let actualNextRotation = nextRotation.map(x => (x + currentPosition) % 10);
  

    if(actualNextRotation.filter(x => x < 3).length > 0
       && currentPositionArray.filter(x => x > 5 ).length > 0 ){
         return false;
    }
     return true;   
}

function isValidMove(){
    //it should be all of the moves minus their width to find if they would go out of bounds
   // console.log(current);
    currentCheck = current.map(x=> x % 10);
    console.log(`The adjusted current ${currentCheck}`);
    for(let i = 0; i<current.length; i++){
        console.log(`The sum of these two are ${currentCheck[i]+ currentPosition}`);

        if((currentCheck[i] + currentPosition) > 9){
            console.log('not a valid move');
        }
    }
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


//This currently only finds where all of the block class spots are
//I have yet to move the pieces down


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



//stuff to do for this app still
    //have a check for scoring and then remove the line that was made
    //have a spot off screen for the next piece

    //make there be levels?... should be easy. simply make the timer intervals move up over time. maybe remove a data point
    // for their next piece. 


