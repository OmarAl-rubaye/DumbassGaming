    var num1 = 0;
    var num2 = 0;
    var correctAnswer = 0;
    function newQuestion() {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;

        var operator = Math.random() < 0.5 ? "+" : "-";
       if (operator === "-") {

            if (num2 > num1) {
            let temp = num1;
            num1 = num2;
            num2 = temp;
            }
        correctAnswer = num1 - num2;
        } else {
        correctAnswer = num1 + num2;
         }

    document.getElementById("question").innerText =
    num1 + " " + operator + " " + num2 + " = ?";

    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerText = "";
    }
    document.getElementById("answer").onkeydown = function(event) {
        if (event.key == "Enter") {
        var userAnswer = Number(document.getElementById("answer").value);

        if (userAnswer == correctAnswer) {
          document.getElementById("feedback").innerText = "Correct! :)";
        } else {
          document.getElementById("feedback").innerText = "Wrong! :( Correct answer was " + correctAnswer;
        }
        setTimeout(newQuestion, 1000);
      }
    }
    newQuestion();