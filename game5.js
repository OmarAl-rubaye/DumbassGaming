document.addEventListener('DOMContentLoaded', function () {
    var secret = 0;
    var tries = 5;

    var guessInput = document.getElementById('guessInput');
    var guessBtn = document.getElementById('guessBtn');
    var startBtn = document.getElementById('startBtn');
    var message = document.getElementById('message');
    var triesEl = document.getElementById('tries');
    var resultEl = document.getElementById('result');

    function newGame() {
        secret = Math.floor(Math.random() * 10) + 1;
        tries = 5;
        guessInput.value = '';
        guessInput.disabled = false;
        guessBtn.disabled = false;
        message.textContent = 'Arvaa luku 1–10. Sinulla on 5 yritystä.';
        triesEl.textContent = tries;
        resultEl.textContent = '-';
    }

    function checkGuess() {
        var guess = Number(guessInput.value);
        if (guess < 1 || guess > 10) {
            message.textContent = 'Kirjoita luku väliltä 1–10.';
            return;
        }

        if (guess === secret) {
            message.textContent = 'Oikein! Voit pelata uudelleen.';
            resultEl.textContent = 'Voitit!';
            guessInput.disabled = true;
            guessBtn.disabled = true;
            return;
        }

        tries -= 1;
        if (tries === 0) {
            message.textContent = 'Hävisit. Oikea luku oli ' + secret + '. Paina Aloita.';
            resultEl.textContent = 'Hävisit';
            guessInput.disabled = true;
            guessBtn.disabled = true;
        } else {
            message.textContent = guess < secret ? 'Liian pieni. Yritä uudelleen.' : 'Liian suuri. Yritä uudelleen.';
            resultEl.textContent = 'Väärin';
        }
        triesEl.textContent = tries;
    }

    startBtn.addEventListener('click', newGame);
    guessBtn.addEventListener('click', checkGuess);

    guessInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });

    newGame();
});