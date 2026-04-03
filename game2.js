
        let words = [
            {fi: "kissa", en: "cat"},
            {fi: "koira", en: "dog"},
            {fi: "talo", en: "house"},
            {fi: "auto", en: "car"},
            {fi: "kirja", en: "book"},
            {fi: "omena", en: "apple"},
            {fi: "koulu", en: "school"},
            {fi: "vesi", en: "water"},
            {fi: "ruoka", en: "food"},
            {fi: "ystävä", en: "friend"},
            {fi: "perhe", en: "family"},
            {fi: "kello", en: "clock"},
            {fi: "ovi", en: "door"},
            {fi: "pöytä", en: "table"},
            {fi: "tuoli", en: "chair"},
            {fi: "aurinko", en: "sun"},
            {fi: "kuu", en: "moon"},
            {fi: "tähti", en: "star"},
            {fi: "meri", en: "sea"},
            {fi: "kaupunki", en: "city"}
        ];

        let currentIndex = 0;
        let score = 0;

        function showQuestion() {
            document.getElementById("question").innerText = words[currentIndex].fi;
            document.getElementById("answer").value = "";
            document.getElementById("result").innerText = "";
        }

        function checkAnswer() {
            let userAnswer = document.getElementById("answer").value.toLowerCase();
            let correctAnswer = words[currentIndex].en;

            if (userAnswer === correctAnswer) {
                document.getElementById("result").innerText = "Oikein! 🎉";
                score++;
            } else {
                document.getElementById("result").innerText =
                    "Väärin meni 😂😂😂😂😂😂😂😂 Oikea vastaus: " + correctAnswer;
            }

            document.getElementById("score").innerText = score;

            currentIndex++;

            if (currentIndex < words.length) {
                setTimeout(showQuestion, 2000);
            } else {
                document.getElementById("question").innerText = "Peli loppui!";
                document.getElementById("result").innerText =
                    "Sait " + score + " / " + words.length + " pistettä!";
            }
        }

        showQuestion();
