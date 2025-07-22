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
    boardOrder.push(`${i}a`, `${i}b`);
};

/*** GAME LOGIC ***/

// Keep track of cards flipped
var flipped = [];

// Keep track of cards matched
var matched = [];

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
    flipped = [];
    matched = [];
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
    timer.textContent = `${oldTime - 1} sec`; // Still need to end game (show alert, disable card listeners, take to new screen) when timer reaches 0 OR when all pairs found, whichever comes first
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
        setInterval(decreaseTime, 1000);
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
            var pairs = document.querySelector('p.pairs-found');
            var id = img.id;
            var index = parseInt(id.slice(id.indexOf('d') + 1)); // Slice: start (inclusive), end (EXclusive, optional)
            var card = boardOrder[index];
            if (!flipped.includes(card) && !matched.includes(card)) {
                img.src = `assets/img/${folder}/${card}.png`;
                flipped.push(card);
                if (flipped.length == 2) {
                    var card1 = flipped[0];
                    var cardNum1 = card1.slice(0, card1.length - 1);
                    var card2 = flipped[1];
                    var cardNum2 = card2.slice(0, card2.length - 1);
                    if (cardNum1 == cardNum2) {
                        var oldPairs = parseInt(pairs.textContent.split('/')[0]); // Split: separatorString, limitIndex (EXclusive, optional)
                        pairs.textContent = `${oldPairs + 1}/8 pairs`;
                        matched.push(card1, card2);
                    } else {
                        setTimeout(() => {
                            document.querySelector(`#card${boardOrder.indexOf(card1)}`).src = `assets/img/${folder}/back.png`;
                            document.querySelector(`#card${boardOrder.indexOf(card2)}`).src = `assets/img/${folder}/back.png`;
                        }, 1000);
                    }
                    flipped = [];
                };
            };
        });
    });
};

/*** HOME SETUP ***/

listenPlay();
listenInstructions();