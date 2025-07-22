/*** DECK MANAGEMENT ***/

// Detect which card deck is selected
var folder = document.querySelector('main').className;
var deckName = '';
switch(folder) {
    case 'chem-in-the-house': 
        deckName = 'Chem in the House';
        break;
};

// Keep track of where each card is on board
var boardOrder = [];

/*** LISTENERS ***/

// Add event listeners to all play btns
const listenPlay = () => {
    document.querySelector('button.play').addEventListener('click', (e) => {
        document.querySelector('main').innerHTML = `
            <section class="game">
            <div class="board-top">
                <p class="time-left center">180 sec</p>
                <p class="pairs-found center">0/8 pairs</p>
                <button class="play restart">Restart</button>
            </div>
            <div class="board"></div>
            </section>
        `;
        listenPlay(); // For restart btn
        addCards();
    });
};

// Add event listeners to all instruction btns
const listenInstructions = () => {
    document.querySelector('button.instructions').addEventListener('click', (e) => {
        document.querySelector('main').innerHTML = `
            <img class="title" src="assets/img/${folder}/titleBanner.png" alt="${deckName}">
            <section class="instructions two-column">
                <div class="text btns">
                    <h3>How to Play</h3>
                    <div class="li">
                        <img class="inline line-start" src="assets/img/goal.png" alt="Target icon">
                        <p> <b>Goal</b>: Match 8 card pairs in 3 minutes</p>
                    </div>
                    <ul>
                        <li>To begin, click on a card to flip it over, and try to find its matching pair by clicking on another card</li>
                        <li>Do your best to remember the locations of the mismatched pairs as you continue flipping cards</li>
                        <li>If you find all the pairs before the time runs out, you win!</li>
                        <li>If 3 minutes pass before you match all the pairs, the cards will shuffle, the timer will reset, and you will get another chance</li>
                    </ul>
                    <p class="center"><i>Good luck!</i></p>
                    <button class="play">Play</button>
                </div>
                <img src="assets/img/${folder}/logoTransparent.png" alt="${deckName} logo">
            </section>
        `;
        listenPlay(); // For new play btn
    });
};

/*** GAME ***/

// Populate board with card deck
const addCards = () => {
    const board = document.querySelector('div.board');
    board.innerHTML = ``;
    for (let i = 1; i <= 16; i++) {
        board.innerHTML += `<img class="card" src="assets/img/${folder}/back.png">`;
    };
};

/*** HOME ***/

listenPlay();
listenInstructions();