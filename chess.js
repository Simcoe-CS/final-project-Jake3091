// Start the board
const board = document.getElementById('board'); //grabs board element from the html
const squares = createBoard(); //make squares
const pieces = createPieces(); // create the pieces

//board squares
function createBoard() {
    const squares = []; //array to square elements
    for (let i = 0; i < 64; i++) { // go for 64 times (8x8=64)
        const square = document.createElement('div'); // creates the next div
        square.classList.add('square'); //add to div
        if ((i + Math.floor(i / 8)) % 2 === 0) { //black or white?
            square.classList.add('light'); // ads light square class
        } else {
            square.classList.add('dark'); //adds dark square class
        }
        board.appendChild(square); //add to element
        squares.push(square); //add to array
    }
    return squares; //return all the array squares!!!! :)
}

//create the pieces
function createPieces() { // array for pices
    const pieces = [];
    const whitePieces = [
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
    ]; //white pieces
    const blackPieces = [
        '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'
    ]; // array for black

    // Add white pieces
    for (let i = 0; i < 16; i++) {
        squares[i + 48].innerHTML = whitePieces[i]; //puts the inner html to the emioji 
        pieces.push({ square: i + 48, piece: whitePieces[i], color: 'white' }); //put it in the array
    }

    // Add black pieces
    for (let i = 0; i < 16; i++) {
        squares[i].innerHTML = blackPieces[i]; // add emoji
        pieces.push({ square: i, piece: blackPieces[i], color: 'black' }); // aray
    }

    return pieces;
}

// click thing
let selectedSquare = null; // variable selects the square index
squares.forEach((square, index) => {
    square.addEventListener('click', () => {
        if (selectedSquare) {
            // Move the piece
            movePiece(selectedSquare, index);
            selectedSquare = null; //resets square
        } else {
            // Select a peice
            selectedSquare = index;
        }
    });
});

// Move a piece
function movePiece(from, to) {
    // valid?
    if (isValidMove(from, to)) {
        // Change on board
        squares[to].innerHTML = squares[from].innerHTML; //puts it, it new square
        squares[from].innerHTML = ''; // changes old square to empty
    }
}

// Check if a move is valid
function isValidMove(from, to) {
   
    return true; //returns true for now, just put in the actual rules later
}


// Define the movement rules for each piece type
const movementRules = {
    '♙': (from, to) => isValidPawnMove(from, to), //black
    '♟': (from, to) => isValidPawnMove(from, to, true), //white
    '♖': (from, to) => isValidRookMove(from, to), //black
    '♜': (from, to) => isValidRookMove(from, to, true), //white
    '♗': (from, to) => isValidBishopMove(from, to), //black
    '♝': (from, to) => isValidBishopMove(from, to, true), //white
};

// rules for pawns
function isValidPawnMove(from, to, isBlack = false) {
    const direction = isBlack ? 1 : -1; // direction of piece for each color
    const fromRow = Math.floor(from / 8); // gets row
    const toRow = Math.floor(to / 8); // target square index
    const fromCol = from % 8; // colunm index
    const toCol = to % 8; // get the column index
    const piece = squares[from].innerHTML; // get the piece symbol
    const targetPiece = squares[to].innerHTML; // get the target square piece symbol

    // check if it goes one forward and the target square is empty
    if (toRow === fromRow + direction && toCol === fromCol && targetPiece === '') {
        return true;
    }

    // Checks if diagonal capture and the target piece is an enemy
    if (toRow === fromRow + direction && (toCol === fromCol + 1 || toCol === fromCol - 1) && targetPiece !== '' && isPieceEnemy(piece, targetPiece)) {  //doesnt work yet, try to do it later
        return true;
    }

    return false;
}

// rook rules
function isValidRookMove(from, to, isBlack = false) {
    const fromRow = Math.floor(from / 8); // gets the row
    const toRow = Math.floor(to / 8); // gets the row
    const fromCol = from % 8; // gets the column
    const toCol = to % 8; // gets the column
    const piece = squares[from].innerHTML; // get the piece symbol
    const targetPiece = squares[to].innerHTML; // get the target square piece symbol

    if (toRow === fromRow || toCol === fromCol) { // checks if it's going straight
        // Check if there are no pieces in between
        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;
        let row = fromRow + rowStep;
        let col = fromCol + colStep;

        while (row !== toRow || col !== toCol) {
            if (squares[row * 8 + col].innerHTML !== '') {
                return false; // There is a piece in between
            }
            row += rowStep;
            col += colStep;
        }

        // Check if the target square is empty or has an enemy piece
        if (targetPiece === '' || isPieceEnemy(piece, targetPiece)) {
            return true;
        }
    }

    return false;
}

// bishop rules
function isValidBishopMove(from, to, isBlack = false) {
    const fromRow = Math.floor(from / 8); // gets the row
    const toRow = Math.floor(to / 8); // gets the row
    const fromCol = from % 8; // gets the column
    const toCol = to % 8; // gets the column
    const piece = squares[from].innerHTML; // get the piece symbol
    const targetPiece = squares[to].innerHTML; // get the target square piece symbol

    if (Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol)) { // checks if it's going diagonally
        // Check if there are no pieces in between
        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;
        let row = fromRow + rowStep;
        let col = fromCol + colStep;

        while (row !== toRow || col !== toCol) {
            if (squares[row * 8 + col].innerHTML !== '') {
                return false; // There is a piece in between
            }
            row += rowStep;
            col += colStep;
        }

        // Check if the target square is empty or has an enemy piece
        if (targetPiece === '' || isPieceEnemy(piece, targetPiece)) {
            return true;
        }
    }

    return false;
}

// Helper function to check if a piece is an enemy
function isPieceEnemy(piece, targetPiece) {
    const isWhite = piece.charCodeAt(0) < 'a'.charCodeAt(0); // Check if the piece is white or black
    const isTargetWhite = targetPiece.charCodeAt(0) < 'a'.charCodeAt(0);
    return isWhite !== isTargetWhite; // Return true if the pieces are of different colors
}

// Update the function to check for valid moves
function movePiece(from, to) {
    const piece = squares[from].innerHTML; // get the symobol from start place
    const isValidMove = movementRules[piece]; //gets the rule

    if (isValidMove && isValidMove(from, to)) {
        // change the shit to work
        squares[to].innerHTML = squares[from].innerHTML; // moves it to the new square
        squares[from].innerHTML = ''; // clears out the og square
    }
}