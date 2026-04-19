const images = [
    "imags/kuva1.png",
    "imags/kuva2.png",
    "imags/kuva3.png",
    "imags/kuva4.png"
];

let cards = [...images, ...images] ;
cards.sort(() => 0.5 - Math.random()) ;

const board = document.getElementById("gameBoard") ;

// 🔥 pakotetaan voittoruutu piiloon alussa
const winMessage = document.getElementById("winMessage");
winMessage.classList.add("hidden");

let first = null ;
let second = null ;
let lock = false;

let matches = 0;
const totalPairs = images.length;

cards.forEach(image => {
    const card = document.createElement("div");
    card.classList.add("card") ;
    card.dataset.image = image;

    const img = document.createElement("img");
    img.src = image ;

    card.appendChild(img);

    card.addEventListener("click", () => {
        if (lock || card === first || card.classList.contains("matched")) return;

        card.classList.add("flipped");

        if (!first) {
            first = card;
            return;
        }

        second = card;
        lock = true;

        if (first.dataset.image === second.dataset.image) {
            matches++;

            first.classList.add("matched") ;
            second.classList.add("matched")  ;

            if (matches === totalPairs) {
                winMessage.classList.remove("hidden");
            }

            first = null;
            second = null;
            lock = false;

        } else {
            setTimeout(() => {
                first.classList.remove("flipped");
                second.classList.remove("flipped")
                ;

                first = null;
                second = null ;
                lock = false ;
            }, 1000);
        }
    });

    board.appendChild(card) ;
});

function restartGame() {
    location.reload()
    ;
}