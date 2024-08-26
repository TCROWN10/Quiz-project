// Quiz Questions and timer functionalities
let questions = [];
let currentQuestionIndex = 0;
let timer;
let timeLeft = 30 * 60;
const answers = [];

const questionContainer = document.getElementById("question-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");
const feedbackModal = document.getElementById("feedback-modal");
const feedbackMessage = document.getElementById("feedback-message");
const closeFeedback = document.getElementById("close-feedback");
const timerDisplay = document.getElementById("timer");
const answeredCountDisplay = document.getElementById("answered-count");

// Fetch questions and initialize quiz after loading
fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    answers.length = questions.length;
    initializeQuiz();
  })
  .catch((error) => console.error("Error loading questions:", error));

function initializeQuiz() {
  loadQuestion(currentQuestionIndex);
  startTimer();
}

function loadQuestion(index) {
  const question = questions[index];
  if (!question) return;

  const userAnswer = answers[index];
  const correctAnswer = question.answer;

  questionContainer.innerHTML = `
    <h2 class="text-xl font-bold mb-4">${question.question}</h2>
    ${question.options
      .map(
        (option, i) => `
      <div class="mb-2">
        <input type="radio" id="option${i}" name="option" value="${option}" class="mr-2" ${
          userAnswer === option
            ? "checked disabled"
            : userAnswer
            ? "disabled"
            : ""
        } />
        <label for="option${i}" class="${
          userAnswer && option === correctAnswer ? "text-green-500" : ""
        } ${
          userAnswer === option && option !== correctAnswer
            ? "text-red-500"
            : ""
        }">
          ${option}
        </label>
      </div>
    `
      )
      .join("")}
  `;

  prevButton.disabled = index === 0;
  nextButton.textContent = index === questions.length - 1 ? "Finish" : "Next";
  submitButton.classList.toggle("hidden", index !== questions.length - 1);
  answeredCountDisplay.textContent = `Question ${index + 1} of ${
    questions.length
  }`;

  document.querySelectorAll('input[name="option"]').forEach((input) => {
    input.addEventListener("change", () => {
      const selectedOption = input.value;

      if (selectedOption === correctAnswer) {
        input.parentElement.classList.add("bg-green-500", "text-white");
      } else {
        input.parentElement.classList.add("bg-red-500", "text-white");
        showCorrectAnswer(correctAnswer);
      }

      disableOptions();
      saveAnswer();
    });
  });
}

function showCorrectAnswer(correctAnswer) {
  document.querySelectorAll('input[name="option"]').forEach((input) => {
    if (input.value === correctAnswer) {
      input.parentElement.classList.add("bg-green-500", "text-white");
    }
  });
}

function disableOptions() {
  document.querySelectorAll('input[name="option"]').forEach((input) => {
    input.disabled = true;
  });
}

function showCorrectAnswer(correctAnswer) {
  document.querySelectorAll('input[name="option"]').forEach((input) => {
    if (input.value === correctAnswer) {
      input.parentElement.classList.add("bg-green-500", "text-white");
    }
  });
}

function disableOptions() {
  document.querySelectorAll('input[name="option"]').forEach((input) => {
    input.disabled = true;
  });
}

function handleNavigation(step) {
  saveAnswer();
  currentQuestionIndex += step;
  if (currentQuestionIndex < 0) currentQuestionIndex = 0;
  if (currentQuestionIndex >= questions.length)
    currentQuestionIndex = questions.length - 1;
  loadQuestion(currentQuestionIndex);
}

function saveAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    answers[currentQuestionIndex] = selectedOption.value;
  }
}

function showFeedback() {
  const score = answers.filter(
    (answer, index) => answer === questions[index].answer
  ).length;
  feedbackMessage.innerHTML = `You have succcessfully completed your quiz. <br>
  Your score is: ${score} / ${questions.length}`;
  feedbackModal.classList.remove("hidden");
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time is up! The quiz has ended.");
      showFeedback();
    } else {
      const minutes = Math.floor(timeLeft / 60 );
      const seconds = timeLeft % 60 ;
      timerDisplay.textContent = ` Time left: ${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
      timeLeft--;
    }
  }, 1000);
}

prevButton.addEventListener("click", () => handleNavigation(-1));
nextButton.addEventListener("click", () => {
  if (currentQuestionIndex === questions.length - 1) {
    showFeedback();
    clearInterval(timer);
  } else {
    handleNavigation(1);
  }
});
submitButton.addEventListener("click", () => {
  showFeedback();
  clearInterval(timer);
});
closeFeedback.addEventListener("click", () =>
  feedbackModal.classList.add("hidden")
);
