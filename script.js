document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('play-again').addEventListener('click', playagain);

function startGame() {
    const cardCount = document.getElementById('cardcount').value;
    if (cardCount < 2) {
        alert('Please enter a number more than 1.');
        return;
    }
    const { cards, colorMap } = generateCards(cardCount);
    document.getElementById('gamestarted').style.display = "none";
    shuffle(cards);
    createBoard(cards, colorMap);
}
function playagain(){
    document.getElementById('play-again').style.display = "none";
    document.getElementById('gamestarted').style.display = "block";
    document.getElementById('game-board').innerHTML = '';
}

function generateCards(cardCount) {
    const values = Array.from({ length: cardCount }, (_, i) => i);
    const colors = values.map(() => getRandomColor());
    const colorMap = new Map();
    values.forEach((value, index) => colorMap.set(value, colors[index]));
    return { cards: values.concat(values), colorMap };
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard(cards, colorMap) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Clear the board before creating a new one
    let flippedCards = [];
    let matchedCards = [];

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;

        // Create front and back faces for the card
        const frontFace = document.createElement('div');
        frontFace.classList.add('front');

        const backFace = document.createElement('div');
        backFace.classList.add('back');
        backFace.textContent = card;
        backFace.style.backgroundColor = colorMap.get(card);

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);

        cardElement.addEventListener('click', function () {
            flipCard(cardElement, flippedCards, matchedCards, cards);
        });
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(card, flippedCards, matchedCards, cards) {
    if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(() => checkForMatch(flippedCards, matchedCards, cards), 500);
    }
}


function checkForMatch(flippedCards, matchedCards, cards) {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        matchedCards.push(card1, card2);
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        card1.style.visibility = "hidden"; 
        card2.style.visibility = "hidden";
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards.length = 0;

    if (matchedCards.length === cards.length) {
        document.getElementById('play-again').style.display = "block";
    }
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

