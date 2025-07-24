const main = document.querySelector('main');

/*** CSS VARIABLES ***/

var rootStyles = getComputedStyle(document.documentElement);
var green = rootStyles.getPropertyValue('--green');
var red = rootStyles.getPropertyValue('--red');
var yellow = rootStyles.getPropertyValue('--yellow');

/*** DECK MANAGEMENT ***/

// Detect which card deck is selected
var folder = main.className;
var deckName = '';
switch(folder) {
    case 'chem-in-the-house': 
        deckName = 'Chem in the House';
        break;
};

// Keep track of where each card is on board
var boardOrder = [];
for (let i = 1; i <= 8; i++) { // Only 8 card pairs for now
    boardOrder.push(`${i}a`, `${i}b`);
};

/*** GAME LOGIC ***/

// Stores total time to facilitate changes
var totalTime = 180;

// Keep track of time passed for point calculation
var timePassed = 0;

// Keep track of moves for point calculation
var moves = 0;

// Keep track of cards flipped
var flipped = [];

// Keep track of cards matched
var matched = [];

// Stores interval ID for decreasing time
var timerInterval = null;

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

// Count down every second
const decreaseTime = () => {
    var timer = document.querySelector('p.time-left');
    var oldTime = parseInt(timer.textContent.split(' ')[0]); // Split: separatorString, limitIndex (EXclusive, optional)
    timer.textContent = `${oldTime - 1} sec`;
    timePassed++;
    if (oldTime - 1 < 11) {
        timer.style.color = `${red}`;
    };
    if (oldTime - 1 == 0) {
        setTimeout(() => {
            alert("Time's up!");
            gameOver(false);
        }, 1);
    };
};

// Show game board screen
const startGame = () => {
    main.innerHTML = `
        <section class="game">
        <div class="board-top">
            <p class="time-left center">${totalTime} sec</p>
            <p class="pairs-found center">0/${boardOrder.length / 2} pairs</p>
            <button class="restart">Restart</button>
        </div>
        <div class="board"></div>
        <div class="test"></div>
        </section>
    `;
    listenRestart(); // For restart btn
    addCards();
    listenCards();
    clearInterval(timerInterval);
    timerInterval = setInterval(decreaseTime, 1000);
    flipped = [];
    matched = [];
    timePassed = 0;
    moves = 0;
};

// Calculate points based on moves used and time taken
// Formula: points = (boardOrder.length * 1000) / (timePassed * moves)
// Max points: 1000 = (16 cards * 1000) / (1 sec * 16 moves)
const calcPoints = () => {
    points = (boardOrder.length * 1000) / (timePassed * moves);
    console.log(`${points}`);
};

// Show game over screen
const gameOver = (won) => {
    main.innerHTML = `
        <img class="title" src="assets/img/chem-in-the-house/titleBanner.png" alt="Chem in the House">
        <section class="game-over two-column">
            <div class="text btns">
                <p class="center">${won ? 'Congrats on your victory!' : 'Better luck next time!'} Would you like to ${won ? 'play' : 'try'} again?</p>
                <button class="play">Yes</button>
            </div>
            <img src="assets/img/chem-in-the-house/logo.png" alt="Chem in the House logo">
        </section>
    `;
    clearInterval(timerInterval);
    listenPlay();
    calcPoints();
};

/*** LISTENERS ***/

// Add event listeners to play btn (uses addCards and itself)
const listenPlay = () => {
    document.querySelector('button.play').addEventListener('click', (e) => {
        startGame();
    });
};

const listenRestart = () => {
    document.querySelector('button.restart').addEventListener('click', (e) => {
        if(confirm('Are you sure you want to restart the game?')) {
            startGame();
        };
    });
};

// Add event listeners to instruction btn (uses listenPlay)
const listenInstructions = () => {
    document.querySelector('button.instructions').addEventListener('click', (e) => {
        main.innerHTML = `
            <img class="title" src="assets/img/${folder}/titleBanner.png" alt="${deckName}">
            <section class="instructions two-column">
                <div class="text btns">
                    <h3>How to Play</h3>
                    <div class="li">
                        <img class="inline line-start" src="assets/img/goal.png" alt="Target icon">
                        <p> <b>Goal</b>: Match ${boardOrder.length / 2} card pairs in 3 minutes</p>
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
                <img src="assets/img/${folder}/logo.png" alt="${deckName} logo">
            </section>
        `;
        listenPlay(); // For new play btn
    });
};

// Add event listeners to all cards
const listenCards = () => {
    document.querySelectorAll('img.card').forEach(img => {
        img.addEventListener('click', (e) => {
            var pairs = document.querySelector('p.pairs-found');
            var id = img.id;
            var index = parseInt(id.slice(id.indexOf('d') + 1)); // Slice: start (inclusive), end (EXclusive, optional)
            var card = boardOrder[index];
            if (!flipped.includes(card) && !matched.includes(card)) {
                moves++;
                img.src = `assets/img/${folder}/${card}.png`;
                var thickness = '2px';
                var outline = `${thickness} solid black`;
                img.style.outline = outline;
                flipped.push(card);
                if (flipped.length == 2) {
                    var card1name = flipped[0];
                    var card1num = card1name.slice(0, card1name.length - 1);
                    var card1 = document.querySelector(`#card${boardOrder.indexOf(card1name)}`);
                    var card2name = flipped[1];
                    var card2num = card2name.slice(0, card2name.length - 1);
                    var card2 = document.querySelector(`#card${boardOrder.indexOf(card2name)}`);
                    if (card1num == card2num) {
                        outline = `${thickness} solid ${green}`
                        card1.style.outline = outline;
                        card2.style.outline = outline;
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        var oldPairs = parseInt(pairs.textContent.split('/')[0]); // Split: separatorString, limitIndex (EXclusive, optional)
                        pairs.textContent = `${oldPairs + 1}/${boardOrder.length / 2} pairs`;
                        matched.push(card1name, card2name);
                        flipped = [];
                        if (oldPairs + 1 == boardOrder.length / 2) {
                            setTimeout(() => {
                                alert("You won!");
                                gameOver(true);
                            }, 2);
                        };
                    } else {
                        outline = `${thickness} solid ${red}`;
                        card1.style.outline = outline;
                        card2.style.outline = outline;
                        setTimeout(() => {
                            outline = 'none';
                            card1.style.outline = outline
                            card2.style.outline = outline;
                            card1.src = `assets/img/${folder}/back.png`;
                            card2.src = `assets/img/${folder}/back.png`;
                            flipped = []; // Must be inside timeout to prevent double-clicking bug
                        }, 1000);
                    };
                };
            };
        });
    });
};

/*** HOME SETUP ***/

listenPlay();
listenInstructions();