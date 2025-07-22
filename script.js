/*** LISTENERS ***/

// Add event listeners to all play btns
const listenPlay = () => {
    document.querySelectorAll('button.play').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('main').innerHTML = `
                <section class="game">
                <p class="time-left">Time Left</p>
                <p class="pairs-found">Pairs Found</p>
                <button class="play restart">Restart</button>
                <div class="board"></div>
                </section>
            `;
            listenPlay(); // For restart btn
        });
    });
};

// Add event listeners to all instruction btns
const listenInstructions = () => {
    document.querySelectorAll('button.instructions').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('main').innerHTML = `
                <img class="title" src="assets/img/chemInTheHouse/titleBanner.png" alt="Chem in the House">
                <section class="instructions two-column">
                    <div class="text btns">
                        <h3>How to Play</h3>
                        <p class="center">The goal is to match all 8 pairs of cards within 3 minutes. To begin, click on a card to flip it over, and try to find its matching pair by clicking on another card. Do your best to rememember the locations of the mismatched pairs as you continue flipping cards. If you find all the pairs before the time runs out, you win! If 3 minutes pass before you match all the pairs, the cards will shuffle, the timer will reset, and you will get another chance.</p>
                        <p class="center"><i>Good luck!</i></p>
                        <button class="play">Play</button>
                    </div>
                    <img src="assets/img/chemInTheHouse/logoTransparent.png" alt="Chem in the House logo">
                </section>
            `;
            listenPlay(); // For new play btn
        });
    });
};

/*** HOME ***/

listenPlay();
listenInstructions();