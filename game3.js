const symbols = ["X","P","S","A"];
let cards = [...symbols, ...symbols];

cards.sort(() => 0.5 - Math.random());

const board = document.getElementById("gameBoard");

let first =  null;
let second = null;
let lock = false;

let matches = 0;
const totalPairs = symbols.length; 

cards.forEach(symbol => { 
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.textContent = " "; 

    card.addEventListener("click", () => {
        if (lock || card === first) return;

        card.textContent = symbol;

        if (!first) {
            first = card;
            return;
        }

        second = card;
        lock = true;

        if (first.dataset.symbol === second.dataset.symbol) {
            matches++;

            first.classList.add("matched");
            second.classList.add("matched");

            if (matches === totalPairs) {
                document.getElementById("winMessage").classList.remove("hidden");
            }

            first = null;
            second = null;
            lock = false;
        } else {
            setTimeout(() => {
                first.textContent = "";
                second.textContent = "";
                first = null;
                second = null;
                lock = false;
            }, 1000);
        }
    });

    board.appendChild(card);
});

function restartGame() {
    location.reload();
}