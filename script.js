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
for (let i = 1; i <= 8; i++) {
    boardOrder.push(`${i}a`);
    boardOrder.push(`${i}b`);
};

/*** GAME LOGIC ***/

// Shuffle deck and repopulate board
const shuffleDeck = () => {
    var copy = [...boardOrder];
    var shuffled = [];
    while (copy.length != 0) {
        // Random: from 0 (inclusive) to multiplied num
        var ranIndex = Math.floor(Math.random() * copy.length);
        var ranCard = `${copy[ranIndex]}`;
        if (copy.includes(ranCard)) {
            shuffled.push(ranCard);
            copy.splice(copy.indexOf(ranCard), 1); // Splice: startIndex, deleteCount
        }
    };
    boardOrder = [...shuffled];
};

// Populate board with card deck (uses shuffleDeck)
const addCards = () => {
    shuffleDeck();
    const board = document.querySelector('div.board');
    board.innerHTML = ``;
    for (let i = 0; i < 16; i++) {
        board.innerHTML += `<img class="card" id="card${i}" src="assets/img/${folder}/back.png">`;
    };
};

/*** LISTENERS ***/

// Add event listeners to play btn (uses addCards and itself)
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
            <div class="test"></div>
            </section>
        `;
        listenPlay(); // For restart btn
        addCards();
        listenCards();
    });
};

// Add event listeners to instruction btn (uses listenPlay)
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

// Add event listeners to all cards
const listenCards = () => {
    document.querySelectorAll('img.card').forEach(img => {
        img.addEventListener('click', (e) => {
            var id = img.id;
            var index = parseInt(id.slice(id.indexOf('d') + 1)); // Slice: start (inclusive), end (EXclusive, optional)
            var card = boardOrder[index];
            img.src = `assets/img/${folder}/${card}.png`;
        });
    });
};

/*** HOME SETUP ***/

listenPlay();
listenInstructions();