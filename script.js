
let current = 0, score = 0, piUser = null;

const questions = [
  { q: "Hewan apa yang bertanduk dan suka mengembik?", a: "Kambing", o: ["Kambing", "Sapi", "Kuda"] },
  { q: "Hewan apa yang memiliki belalai panjang?", a: "Gajah", o: ["Gajah", "Jerapah", "Kerbau"] },
  { q: "Hewan yang suka meloncat dan membawa anak di kantong?", a: "Kanguru", o: ["Kelinci", "Kucing", "Kanguru"] },
  { q: "Hewan malam yang bisa terbang diam-diam?", a: "Burung Hantu", o: ["Burung Pipit", "Burung Hantu", "Elang"] },
  { q: "Hewan amfibi hijau suka lompat-lompat?", a: "Katak", o: ["Katak", "Ikan", "Tikus"] }
];

function startPiLogin() {
  Pi.authenticate(['username'], function(user) {
    piUser = user;
    document.querySelector("button").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    showQuestion();
  });
}

function playSound(correct) {
  document.getElementById(correct ? 'correctSound' : 'wrongSound').play();
}

function showQuestion() {
  const q = questions[current];
  document.getElementById("question").innerText = q.q;
  const options = document.getElementById("options");
  options.innerHTML = "";
  q.o.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => {
      if (opt === q.a) {
        score++;
        playSound(true);
      } else {
        playSound(false);
      }
      current++;
      if (current < questions.length) showQuestion();
      else showResult();
    };
    options.appendChild(btn);
  });
}

function showResult() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("score").innerText = "Skor kamu: " + score + " dari 5";

  if (score === 5 && piUser) {
    Pi.createPayment({
      amount: 1,
      memo: "Hadiah dari ZooQuiz!",
      metadata: { type: "quiz_reward" },
      to: piUser.username
    }, {
      onReadyForServerApproval: function(paymentId) {},
      onReadyForServerCompletion: function(paymentId, txid) {
        Pi.completePayment(paymentId);
        alert("Selamat! Kamu mendapat 1 Test Pi 🎉");
      },
      onCancel: function(err) { alert("Pembayaran dibatalkan."); },
      onError: function(err) { alert("Terjadi error: " + err); }
    });
  }
}
