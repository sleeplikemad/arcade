let turn = 'true' //true-O false - X
const colorX = 'rgb(210, 70, 223)'
const colorO = 'rgb(88, 223, 70)'
let gameMap = [0,0,0,0,0,0,0,0,0];
let scoreX = 0;
let scoreO = 0;
let draws = 0;
let enableAI = false;
let catsGame = false;

//randomly chooses 'X' or 'O' as first player
function chooseFirst() {
    turn = (0 == Math.floor(Math.random() * 2))
}

//choose whether to play 1 player or 2 player mode
function gameMode() {
    $('.pregame').css('display', 'none')
    loadInput($(this).attr('id') === "oneplayer")
}

//loads the right input screen
function loadInput(single) {
    $('.inputScreen').css('display', 'grid')
    if(single) {
        $('.secondInput').val('Computer').attr('readonly', 'true');
        enableAI = true
    }
}

//Initiatializes the tictactoe board with the player names set 
function start() {
    $('.playerO').text($('.firstInput').val())
    $('.playerX').text($('.secondInput').val())
    $('.inputScreen').css('display', 'none')
    $('.board').css('display', 'grid')
}

//fills an empty square in the tictactoe grid
function fillBox() {
    let tagID = $(this).attr('id')
    if(turn || (!turn && !enableAI))
        makeTurn(tagID);
    if(!catsGame && enableAI && !turn) {
        makeTurn(computerMove());
    }
}

//helper-fillBox: series of commands/checks per turn
function makeTurn(id) {
    let winner = '';
    updateMap(id, false);
    updateSquare(id);
    winner = winCheck();
    if(winner == "" && catsCheck()) {
        winner = 'C'
        catsGame = true;
    }
    if(winner) {
        console.log("Game Over: ", winner)
        gameOver(winner);
        catsGame = true; //not catsgame.  just flipping so ai doesn't keep making moves in fillBox
    }
}

//helper-turn: updates array of game. O are -1, X are 1, default(empty) is 0
function updateMap(id, reset) {
    let newVal = -1
    if(reset) {
        newVal = 0;
        gameMap[id] = newVal;
    }
    else if(gameMap[id] == 0) {
        if(!turn) 
            newVal = 1 
        gameMap[id] = newVal;
    }
}

//helper-turn: updates desired square with X or O 
function updateSquare(id) {
    if($("#" + id).text() === '') {
        if(turn) {
            $("#" + id).text('O')
            colorFlip(colorO, id)
        }
        else {
            $("#" + id).text('X')
            colorFlip(colorX, id)
        }
        changeTurn();
        updateBorder();
    }
}

function updateBorder() {
    if(turn) {
        $('.board').css('border', '15px solid rgb(88, 223, 70)')
    }
    else {
        $('.board').css('border', '15px solid rgb(210, 70, 223)')
    }
}

//helper-updateSquare: changes color of tag with given id to given color
function colorFlip(color, id) {
    $('#' + id).css('color', color)
}

//helper-updateSquare: toggles turn.  originally in fillBox, moved to updateSquare to include under empty square check
function changeTurn() {
    turn = !turn;
}

//helper-turn: checks 'gameMap' array to see if game is won
function winCheck() {
    let sum = 0;
    let winner = '';
    //check rows
    for(let i = 0; i < gameMap.length; i += 3) {
        if(winner === '') {
            winner = checkSum(gameMap[i], gameMap[i+1], gameMap[i+2], 3);
            console.log("WinCheck Row: ", winner)
        }
    }

    //check columns
    for(let i = 0; i < 3; i++) {
        if(winner === '') {
            winner = checkSum(gameMap[i], gameMap[i+3], gameMap[i+6], 3);
            console.log("WinCheck Col: ", winner)
        }
    }
    
    //check diagonals
    if(winner === '') {
        winner = checkSum(gameMap[0], gameMap[4], gameMap[8], 3);
        console.log("WinCheck Diag1: ", winner)
    }

    if(winner === '') {
        winner = checkSum(gameMap[2], gameMap[4], gameMap[6], 3);
        console.log("WinCheck diag2: ", winner)
    }
    

    console.log("WinCheck Final: ", winner)
    return winner;
}

//helper - winCheck: adds up values of 3 squares and returns either null, 'X' or 'O' as winner.  
function checkSum(num1, num2, num3, checkVal) {
    let sum = num1 + num2 + num3;
    let winner = '';
    if(sum === (-1*checkVal)) {
        winner = 'O'
    } else if(sum === checkVal) {
        winner = 'X'
    }

    return winner;
}

//helper-turn: Game ending procedures.  
function gameOver(winnerVal) {
    console.log("GameOver Start: ", winnerVal)
    updateTotal(winnerVal)
    console.log("GameOver Mid: ", winnerVal)
    displayEnd(winnerVal);
    console.log("GameOVer End: ", winnerVal)
}

//helper - gameOver: increments score of winner
function updateTotal(winner) {
    if(winner === 'X') {
        $('.scoreX').text(++scoreX)
    }
    else if (winner === 'O') {
        $('.scoreO').text(++scoreO)
    }
    else {
        $('.draws').text(++draws)
    }
    
}

//helper - gameOver: Displays winner on screen
function displayEnd(winner) {
    console.log("DisplayEND start: ", winner)
    $('.other-board').css('display', 'grid')
    if(winner === "O") {
        console.log("DisplayEnd O: ", winner)
        $('.winnero').css('display', 'block')
    }
    else if(winner === "X") {
        $('.winnerx').css('display', 'block')
        console.log("DisplayEnd X: ", winner)
    }
    else if(winner === "C") {
        $('.draw').css('display', 'block')
        console.log("DisplayEnd Draw: ", winner)
    }
    console.log("DisplayEnd End: ", winner)
    $('.board').css('display', 'none')
    console.log("DisplayEND DONE: ", winner)
}

//resets board after winning 
function resetBoard() {
    $('.board').css('display', 'grid')
    for(let i = 0; i < gameMap.length; i++) {
        updateMap(i, true)
        $("#" + i).text('')
    }
    chooseFirst();
    updateBorder();
    catsGame = false;
    $('.other-board').css('display', 'none')
    $('.winnero').css('display', 'none')
    $('.winnerx').css('display', 'none')
    $('.draw').css('display','none')
    if(!turn && enableAI) { //incase AI goes first
        makeTurn(computerMove());
    }
}

//checks if game is cat's game
function catsCheck() {
    let cats = true;
    for(let i = 0; i < gameMap.length; i++) {
        if(gameMap[i] === 0) {
            cats = false;
            break;
        }
    }
    return cats;
}

//evaluates next move for computer to make.  
function computerMove(){
    let next;
    next = checkExtreme();
    if(next === -1) {
        next = guess();
    }
    console.log("AI MOVED: ", next)
    return next;
}

//helper-computerMove: checks extreme conditions(1 move from winning/losing) returns index of
//next move which prioritizes win moves
function checkExtreme() {
    let nextPossible = -1;
    let winner = ''
    //check rows
    for(let i = 0; i < gameMap.length; i += 3) {
        if(winner != 'X') {
            winner = checkSum(gameMap[i], gameMap[i+1], gameMap[i+2], 2);
            if(winner) {
                nextPossible = findEmpty(gameMap[i], gameMap[i+1], gameMap[i+2])
                nextPossible = nextPossible + i;
                if(winner === "X") {
                    break;
                }
            }
        }
    }

    //check columns
    for(let i = 0; i < 3; i++) {
        if(winner != "X") {
            winner = checkSum(gameMap[i], gameMap[i+3], gameMap[i+6], 2);
            if(winner) {
                nextPossible = findEmpty(gameMap[i], gameMap[i+3], gameMap[i+6])
                nextPossible = nextPossible*3 + i;
                if(winner === "X") {
                    break;
                }
            }

        }
    }
    
    //check diagonals
    if(winner != "X") {
        winner = checkSum(gameMap[0], gameMap[4], gameMap[8], 2);
        if(winner) {
            nextPossible = findEmpty(gameMap[0], gameMap[4], gameMap[8])
            nextPossible = nextPossible*4;
        }
    }

    if(winner != 'X') {
        winner = checkSum(gameMap[2], gameMap[4], gameMap[6], 2);
        if(winner) {
            nextPossible = findEmpty(gameMap[2], gameMap[4], gameMap[6])
            nextPossible = (nextPossible*2)+2
        }
    }
    return nextPossible;
}

//helper-computerMove: checks which of the three values is null and returns an int
function findEmpty(num1, num2, num3) {
    let empty = 0;
    if(num1 == 0) {
        empty = 0
    }
    else if(num2 == 0) {
        empty = 1
    }
    else if(num3 == 0) {
        empty = 2
    }
    return empty;
}

//helper-computerMove: randomly choose spot, checks if empty.  commits.
function guess() {
    let guess = Math.floor(Math.random() * 9);
    while(gameMap[guess] != 0) {

        guess = Math.floor(Math.random() * 9);
        
    }
    return guess;
}

const audio = document.getElementById("music").volume = 0.2
audio.oncanplaythrough = function() {audio.play()}

chooseFirst();
updateBorder();
if(!turn) { //incase AI goes first
    makeTurn(computerMove());
}
$('.pregame div').click(gameMode)
$('.board div').click(fillBox)

$('.other-board').click(resetBoard)
$('form .submitIn').click(function(e) {
    e.preventDefault();
    start();
});