
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.querySelector('#score_points'),
    },

    cardsSprites: {
        avatar: document.querySelector('#card-image'),
        name: document.querySelector('#card-name'),
        type: document.querySelector('#card-type'),
    },

    fieldCards: {
        player: document.querySelector('#player-field-card'),
        computer: document.querySelector('#computer-field-card'),
    },

    actions: {
        button: document.querySelector('#next-duel'),
    },
};

const playerSides = {
    player1: 'player-cards',
    computer: 'computer-cards',
};

const pathImages = './src/assets/icons/';

const cardDate = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },

    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },

    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardDate.length);
    return cardDate[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', idCard);
    cardImage.classList.add('card');

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'));
        });

        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(idCard);
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {

    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';
    await hiddenCardDetails();

    state.fieldCards.player.src = cardDate[cardId].img
    state.fieldCards.computer.src = cardDate[computerCardId].img

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults); 
}

async function hiddenCardDetails() {
    state.cardsSprites.avatar.textContent = '';
    state.cardsSprites.name.textContent = '';
    state.cardsSprites.type.textContent = '';
}

async function drawButton(text) {
    state.actions.button.textContent = text.toUpperCase();
    state.actions.button.style.display = 'block';
}

async function updateScore() {
    const playerScore = state.score.playerScore;
    const computerScore = state.score.computerScore;
    state.score.scoreBox.textContent = `Win: ${playerScore} | Lose: ${computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = 'draw';
    let playerCard = cardDate[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = 'win';
        state.score.playerScore++;
    } 
    
    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = 'lose';
        state.score.computerScore++;
    }

    playAudio(duelResults)

    return duelResults;
}

async function removeAllCardsImages() {
    //Computer
    let cards = document.querySelector('#computer-cards');
    let imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    // Player
    cards = document.querySelector('#player-cards');
    imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(id) {
    state.cardsSprites.avatar.src = cardDate[id].img;
    state.cardsSprites.name.textContent = cardDate[id].name;
    state.cardsSprites.type.textContent = `Attribute: ${cardDate[id].type}`;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardsSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    /* state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none'; */

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    state.cardsSprites.name.textContent = 'Selecione';
    state.cardsSprites.type.textContent = 'uma carta';
    
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.querySelector('#bgm');
    bgm.play();
}

init();

