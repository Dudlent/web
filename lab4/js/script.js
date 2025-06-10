var square_class = document.getElementsByClassName("square");
var white_checker_class = document.getElementsByClassName("white_checker");
var black_checker_class = document.getElementsByClassName("black_checker");
var table = document.getElementById("table");
var score = document.getElementById("score");
var black_background = document.getElementById("black_background");
var moveSound = document.getElementById("moveSound");
var winSound = document.getElementById("winSound");
var windowHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;  ;
var windowWidth =  window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
var moveLength = 80 ;
var moveDeviation = 10;
var Dimension = 1;
var selectedPiece,selectedPieceindex;
var upRight,upLeft,downLeft,downRight; 
var contor = 0 , gameOver = 0;
var bigScreen = 1;

var block = [];
var w_checker = [];
var b_checker = [];
var the_checker ;
var oneMove;
var anotherMove;
var mustAttack = false;
var multiplier = 1

var tableLimit,reverse_tableLimit ,  moveUpLeft,moveUpRight, moveDownLeft,moveDownRight , tableLimitLeft, tableLimitRight;

	getDimension();
	if(windowWidth > 640){
		moveLength = 80;
		moveDeviation = 10;
	}
	else{
		moveLength = 50;
		moveDeviation = 6;
	}


var square_p = function(square,index){
	this.id = square;
	this.ocupied = false;
	this.pieceId = undefined;
	this.id.onclick = function() {
		makeMove(index);
	}
}

var checker = function(piece,color,square) {
	this.id = piece;
	this.color = color;
	this.king = false;
	this.ocupied_square = square;
	this.alive = true;
	this.attack = false;
	if(square%8){
		this.coordX= square%8;
		this.coordY = Math.floor(square/8) + 1 ;
	}
	else{
		this.coordX = 8;
		this.coordY = square/8 ;
	}
	this.id.onclick = function  () {
		showMoves(piece);	
	}
}

checker.prototype.setCoord = function(X,Y){
	var x = (this.coordX - 1  ) * moveLength + moveDeviation;
	var y = (this.coordY - 1 ) * moveLength  + moveDeviation;
	this.id.style.top = y + 'px';
	this.id.style.left = x + 'px';
}

checker.prototype.changeCoord = function(X,Y){
	this.coordY +=Y;
	this.coordX += X;
}

checker.prototype.checkIfKing = function () {
  if (!this.king) {
    if (this.color === "white" && this.coordY === 8) {
      this.king = true;
      this.id.style.border = "4px solid gold";
      this.id.style.boxShadow = "0 0 10px gold";
      this.id.style.animation = "crownGlow 1.5s infinite";
    }

    if (this.color === "black" && this.coordY === 1) {
      this.king = true;
      this.id.style.border = "4px solid gold";
      this.id.style.boxShadow = "0 0 10px gold";
      this.id.style.animation = "crownGlow 1.5s infinite";
    }
  }
};

for (var i = 1; i <=64; i++)
	block[i] =new square_p(square_class[i],i);

for (var i = 1; i <= 4; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i -1 );
	w_checker[i].setCoord(0,0);
	block[2*i - 1].ocupied = true;
	block[2*i - 1].pieceId =w_checker[i];
}

for (var i = 5; i <= 8; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i );
	w_checker[i].setCoord(0,0);
	block[2*i].ocupied = true;
	block[2*i].pieceId = w_checker[i];
}

for (var i = 9; i <= 12; i++){
	w_checker[i] = new checker(white_checker_class[i], "white", 2*i - 1 );
	w_checker[i].setCoord(0,0);
	block[2*i - 1].ocupied = true;
	block[2*i - 1].pieceId = w_checker[i];
}

for (var i = 1; i <= 4; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 56 + 2*i  );
	b_checker[i].setCoord(0,0);
	block[56 +  2*i ].ocupied = true;
	block[56+  2*i ].pieceId =b_checker[i];
}

for (var i = 5; i <= 8; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 40 +  2*i - 1 );
	b_checker[i].setCoord(0,0);
	block[ 40 + 2*i - 1].ocupied = true;
	block[ 40 + 2*i - 1].pieceId = b_checker[i];
}

for (var i = 9; i <= 12; i++){
	b_checker[i] = new checker(black_checker_class[i], "black", 24 + 2*i  );
	b_checker[i].setCoord(0,0);
	block[24 + 2*i ].ocupied = true;
	block[24 + 2*i ].pieceId = b_checker[i];
}

the_checker = w_checker;

function showMoves (piece) {
    var match = false;
    mustAttack = false;
    if(selectedPiece){
            erase_roads(selectedPiece);
    }
    selectedPiece = piece;
    var i,j; 
    for ( j = 1; j <= 12; j++){
        if(the_checker[j].id == piece){
            i = j;
            selectedPieceindex = j;
            match = true;
        }
    }
    if(oneMove && !attackMoves(oneMove)){
        changeTurns(oneMove);
        oneMove = undefined;
        return false;
    }
    if(oneMove && oneMove != the_checker[i] ){
        return false;
    }
    if(!match) {
     return 0 ; 
    }
    if(the_checker[i].color =="white"){
        tableLimit = 8;
        tableLimitRight = 1;
        tableLimitLeft = 8;
        moveUpRight = 7;
        moveUpLeft = 9;
        moveDownRight = - 9;
        moveDownLeft = -7;
    }
    else{
        tableLimit = 1;
        tableLimitRight = 8;
        tableLimitLeft = 1;
        moveUpRight = -7;
        moveUpLeft = -9;
        moveDownRight = 9;
        moveDownLeft = 7;
    }
        attackMoves(the_checker[i]); 
     if(!mustAttack){
       downLeft = checkMove( the_checker[i] , tableLimit , tableLimitRight , moveUpRight , downLeft);
        downRight = checkMove( the_checker[i] , tableLimit , tableLimitLeft , moveUpLeft , downRight);
        if(the_checker[i].king){
            upLeft = checkMove( the_checker[i] , reverse_tableLimit , tableLimitRight , moveDownRight , upLeft);
            upRight = checkMove( the_checker[i], reverse_tableLimit , tableLimitLeft , moveDownLeft, upRight)
        }
    }
    if(downLeft || downRight || upLeft || upRight){
            return true;
        }
    return false;
}


function erase_roads(piece) {
    const directions = [upLeft, upRight, downLeft, downRight];
    for (let i = 0; i < directions.length; i++) {
        let index = directions[i];
        if (index && block[index] && block[index].id) {
            const isWhiteSquare = ((Math.floor((index - 1) / 8) + (index - 1) % 8) % 2 === 0);
            block[index].id.style.background = isWhiteSquare ? "#F0D2B4" : "#3E1B00";
        }
    }

    upLeft = upRight = downLeft = downRight = undefined;
}

function makeMove (index) {
	var isMove = false;
	if(!selectedPiece) 
		return false;
	if(index != upLeft && index != upRight && index != downLeft && index != downRight){
		erase_roads(0);
		selectedPiece = undefined;
		return false;
	}

	if(the_checker[1].color=="white"){
		cpy_downRight = upRight;
		cpy_downLeft = upLeft;
		cpy_upLeft = downLeft;
		cpy_upRight = downRight;
	}
	else{
		cpy_downRight = upLeft;
		cpy_downLeft = upRight;
		cpy_upLeft = downRight;
		cpy_upRight = downLeft;
	}  

	if(mustAttack)
		multiplier = 2;
	else
		multiplier = 1;


		if(index == cpy_upRight){
			isMove = true;		
			if(the_checker[1].color=="white"){
				executeMove( multiplier * 1, multiplier * 1, multiplier * 9 );
				if(mustAttack) eliminateCheck(index - 9);
			}
			else{
				executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
				if(mustAttack) eliminateCheck( index + 7 );
			}
		}

		if(index == cpy_upLeft){
	
			isMove = true;
			if(the_checker[1].color=="white"){
				executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
			 	if(mustAttack)	eliminateCheck(index - 7 );				
			}
			else{
				executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
				if (mustAttack) eliminateCheck( index + 9 );
			}
		}

		if(the_checker[selectedPieceindex].king){

			if(index == cpy_downRight){
				isMove = true;
				if(the_checker[1].color=="white"){
					executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
					if(mustAttack) eliminateCheck ( index  + 7) ;
				}
				else{
					executeMove( multiplier * 1, multiplier * 1, multiplier * 9);
					if(mustAttack) eliminateCheck ( index  - 9) ;
				}
			}

		if(index == cpy_downLeft){
			isMove = true;
				if(the_checker[1].color=="white"){
					executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
					if(mustAttack) eliminateCheck ( index  + 9) ;
				}
				else{
					executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
					if(mustAttack) eliminateCheck ( index  - 7) ;
				}
			}
		}

	erase_roads(0);
	the_checker[selectedPieceindex].checkIfKing();
	if (isMove) {
			playSound(moveSound);
			anotherMove = undefined;
		 if(mustAttack) {
			 	anotherMove = attackMoves(the_checker[selectedPieceindex]);
		 }
		if (anotherMove){
			oneMove = the_checker[selectedPieceindex];
			showMoves(oneMove);
		}
		else{
			oneMove = undefined;
		 	changeTurns(the_checker[1]);
		 	gameOver = checkIfLost();
		 	if(gameOver) { setTimeout( declareWinner(),3000 ); return false};
		 	gameOver = checkForMoves();
		 	if(gameOver) { setTimeout( declareWinner() ,3000) ; return false};
		}
	}
}


function executeMove (X,Y,nSquare){
	the_checker[selectedPieceindex].changeCoord(X,Y); 
	the_checker[selectedPieceindex].setCoord(0,0);
	block[the_checker[selectedPieceindex].ocupied_square].ocupied = false;
	block[the_checker[selectedPieceindex].ocupied_square + nSquare].ocupied = true;
	block[the_checker[selectedPieceindex].ocupied_square + nSquare].pieceId = 	block[the_checker[selectedPieceindex].ocupied_square ].pieceId;
	block[the_checker[selectedPieceindex].ocupied_square ].pieceId = undefined; 	
	the_checker[selectedPieceindex].ocupied_square += nSquare;

}

function checkMove(Apiece,tLimit,tLimit_Side,moveDirection,theDirection){
	if(Apiece.coordY != tLimit){
		if(Apiece.coordX != tLimit_Side && !block[ Apiece.ocupied_square + moveDirection ].ocupied){
			block[ Apiece.ocupied_square + moveDirection ].id.style.background = "#e00b21";
			theDirection = Apiece.ocupied_square + moveDirection;
		}
	else
			theDirection = undefined;
	}
	else
		theDirection = undefined;
	return theDirection;
}

function  checkAttack( check , X, Y , negX , negY, squareMove, direction){
	if(check.coordX * negX >= 	X * negX && check.coordY *negY <= Y * negY && block[check.ocupied_square + squareMove ].ocupied && block[check.ocupied_square + squareMove].pieceId.color != check.color && !block[check.ocupied_square + squareMove * 2 ].ocupied){
		mustAttack = true;
		direction = check.ocupied_square +  squareMove*2 ;
		block[direction].id.style.background = "#704923";
		block[direction].id.style.animation = "blink 1s infinite";
		return direction ;
	}
	else
		direction =  undefined;
		return direction;
}

function eliminateCheck(indexx){
	if(indexx < 1 || indexx > 64)
		return  0;

	var x =block[ indexx ].pieceId ;
	x.alive =false;
	block[ indexx ].ocupied = false;
	x.id.style.display  = "none";
}

 	
function attackMoves(ckc){

 		upRight = undefined;
 		upLeft = undefined;
 		downRight = undefined;
 		downLeft = undefined;

 	if(ckc.king ){
 		if(ckc.color == "white"){
			upRight = checkAttack( ckc , 6, 3 , -1 , -1 , -7, upRight );
			upLeft = checkAttack( ckc, 3 , 3 , 1 , -1 , -9 , upLeft );
		}
		else{
	 		downLeft = checkAttack( ckc , 3, 6, 1 , 1 , 7 , downLeft );
			downRight = checkAttack( ckc , 6 , 6 , -1, 1 ,9 , downRight );		
		}
	}
	if(ckc.color == "white"){
	 	downLeft = checkAttack( ckc , 3, 6, 1 , 1 , 7 , downLeft );
		downRight = checkAttack( ckc , 6 , 6 , -1, 1 ,9 , downRight );
	}
	else{
		upRight = checkAttack( ckc , 6, 3 , -1 , -1 , -7, upRight );
		upLeft = checkAttack( ckc, 3 , 3 , 1 , -1 , -9 , upLeft );
	}
 	
 	if(ckc.color== "black" && (upRight || upLeft || downLeft || downRight ) ) {
	 	var p = upLeft;
	 	upLeft = downLeft;
	 	downLeft = p;

	 	p = upRight;
	 	upRight = downRight;
	 	downRight = p;

	 	p = downLeft ;
	 	downLeft = downRight;
	 	downRight = p;

	 	p = upRight ;
	 	upRight = upLeft;
	 	upLeft = p;
 	}
 	if(upLeft != undefined || upRight != undefined || downRight != undefined || downLeft != undefined){
 		return true;

 	}
 	return false;
}
function createBoard() {
    const table = document.getElementById("table");
    table.innerHTML = ""; // Очистка старого поля

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.className = "square " + ((row + col) % 2 === 0 ? "white_square" : "black_square");
            square.dataset.index = row * 8 + col + 1;
            square.style.width = moveLength + "px";
            square.style.height = moveLength + "px";
            square.classList.add("square");
            square.onclick = function () {
                makeMove(parseInt(square.dataset.index));
            };
            table.appendChild(square);
        }
        const clear = document.createElement("div");
        clear.className = "clear_float";
        table.appendChild(clear);
    }

    let squares = document.getElementsByClassName("square");
    for (let i = 1; i <= 64; i++) {
        if (!block[i]) {
            block[i] = new square_p(squares[i - 1], i);
        } else {
            block[i].id = squares[i - 1];
        }
    }
}

function changeTurns(ckc){
		if(ckc.color=="white")
	the_checker = b_checker;
else
	the_checker = w_checker;
 }

function checkIfLost(){
	var i;
	for(i = 1 ; i <= 12; i++)
		if(the_checker[i].alive)
			return false;
	return true;
}

function  checkForMoves(){
	var i ;
	for(i = 1 ; i <= 12; i++)
		if(the_checker[i].alive && showMoves(the_checker[i].id)){
			erase_roads(0);
			return false;
		}
	return true;
}

function declareWinner(){
	playSound(winSound);
	black_background.style.display = "inline";
	score.style.display = "block";
if(the_checker[1].color == "white")
	score.innerHTML = "Победа Чёрных";
else
	score.innerHTML = "Победа Белых";
}

function playSound(sound){
	if(sound) sound.play();
}


function getDimension (){
	contor ++;
	windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;  ;
	windowWidth =  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}
document.getElementsByTagName("BODY")[0].onresize = function(){

	getDimension();
	var cpy_bigScreen = bigScreen ;

if(windowWidth < 650){
		moveLength = 50;
		moveDeviation = 6; 
		if(bigScreen == 1) bigScreen = -1;
	}
if(windowWidth > 650){
		moveLength = 80;
		moveDeviation = 10; 
		if(bigScreen == -1) bigScreen = 1;
	}

	if(bigScreen !=cpy_bigScreen){
	for(var i = 1; i <= 12; i++){
		b_checker[i].setCoord(0,0);
		w_checker[i].setCoord(0,0);
	}
	}
	window.onload = function () {
    createBoard();
  
};
}