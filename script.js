
const questions = [
    {
        type: "single",
        category: "Computer Science",
        question: "Which language is primarily used to structure a web page?",
        options: ["Python", "HTML", "C++", "Java"],
        answer: 1,
        explanation: "HTML defines the structure and content of web pages."
    },
    {
        type: "single",
        category: "Programming",
        question: "Which symbol is used to end most statements in JavaScript?",
        options: [".", ":", ";", ","],
        answer: 2,
        explanation: "A semicolon is commonly used to terminate JavaScript statements."
    },
    {
        type: "multi",
        category: "Web Development",
        question: "Which of these are web development technologies?",
        options: ["HTML", "CSS", "JavaScript", "MS Paint"],
        answer: [0, 1, 2],
        explanation: "HTML, CSS and JavaScript are core web technologies."
    },
    {
        type: "fill",
        category: "Programming",
        question: "Which keyword declares a variable in JavaScript?",
        hint: "Type one answer: let, var or const.",
        answer: ["let", "var", "const"],
        explanation: "let, var and const can all be used to declare variables."
    },
    {
        type: "single",
        category: "General Knowledge",
        question: "What is the capital of India?",
        options: ["Mumbai", "Bengaluru", "New Delhi", "Chennai"],
        answer: 2,
        explanation: "New Delhi is the capital of India."
    },
    {
        type: "multi",
        category: "Computer Science",
        question: "Which of these are programming languages?",
        options: ["Python", "Java", "C", "HTML"],
        answer: [0, 1, 2],
        explanation: "Python, Java and C are programming languages. HTML is a markup language."
    },
    {
        type: "single",
        category: "JavaScript",
        question: "Which method displays a message in the browser console?",
        options: [
            "console.log()",
            "print.page()",
            "show.message()",
            "document.writeLog()"
        ],
        answer: 0,
        explanation: "console.log() prints information to the browser console."
    },
    {
        type: "fill",
        category: "HTML",
        question: "Which HTML tag creates a hyperlink?",
        hint: "Enter the tag name, with or without angle brackets.",
        answer: ["a", "<a>", "anchor"],
        explanation: "The <a> tag creates a hyperlink in HTML."
    },
    {
        type: "single",
        category: "Computer Basics",
        question: "Which component is known as the brain of a computer?",
        options: ["Monitor", "Keyboard", "CPU", "Mouse"],
        answer: 2,
        explanation: "The CPU executes instructions and processes data."
    },
    {
        type: "multi",
        category: "Web Development",
        question: "Which of these are valid CSS properties?",
        options: ["color", "font-size", "background-color", "print-screen"],
        answer: [0, 1, 2],
        explanation: "color, font-size and background-color are valid CSS properties."
    }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const questionType = document.getElementById("question-type");
const questionCount = document.getElementById("question-count");
const category = document.getElementById("category");
const points = document.getElementById("points");
const hint = document.getElementById("question-hint");
const answerArea = document.getElementById("answer-area");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");
const currentScore = document.getElementById("current-score");

let currentQuestion = 0;
let score = 0;
let correctCount = 0;
let selectedAnswers = [];
let answered = false;

const POINTS_PER_QUESTION = 10;

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    correctCount = 0;
    selectedAnswers = [];
    answered = false;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    currentScore.textContent = score;

    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];

    selectedAnswers = [];
    answered = false;

    questionText.textContent = q.question;
    category.textContent = q.category;
    points.textContent = `${POINTS_PER_QUESTION} points`;

    questionCount.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    progressBar.style.width =
        `${(currentQuestion / questions.length) * 100}%`;

    questionType.textContent =
        q.type === "single" ? "SINGLE SELECT" :
        q.type === "multi" ? "MULTI SELECT" :
        "FILL IN THE BLANKS";

    hint.textContent =
        q.type === "multi"
            ? "Select all correct answers."
            : q.type === "fill"
                ? q.hint
                : "Choose one correct answer.";

    feedback.textContent = "";
    feedback.className = "feedback";

    answerArea.replaceChildren();

    if (q.type === "fill") {
        const input = document.createElement("input");

        input.type = "text";
        input.className = "fill-input";
        input.id = "fill-answer";
        input.placeholder = "Type your answer here...";
        input.setAttribute("aria-label", "Your answer");

        input.addEventListener("keydown", event => {
            if (event.key === "Enter" && !answered) {
                checkAnswer();
            }
        });

        answerArea.appendChild(input);
    } else {
        q.options.forEach((option, index) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "option";

            const letter = document.createElement("span");
            letter.className = "option-letter";
            letter.textContent = String.fromCharCode(65 + index);

            const text = document.createElement("span");
            text.textContent = option;

            button.append(letter, text);

            button.addEventListener("click", () => {
                selectOption(index);
            });

            answerArea.appendChild(button);
        });
    }

    nextBtn.textContent = "Check Answer →";
}

function selectOption(index) {
    if (answered) return;

    const q = questions[currentQuestion];

    if (q.type === "single") {
        selectedAnswers = [index];
    } else {
        if (selectedAnswers.includes(index)) {
            selectedAnswers = selectedAnswers.filter(
                answer => answer !== index
            );
        } else {
            selectedAnswers.push(index);
        }
    }

    updateSelectedOptions();
}

function updateSelectedOptions() {
    const buttons = answerArea.querySelectorAll(".option");

    buttons.forEach((button, index) => {
        button.classList.toggle(
            "selected",
            selectedAnswers.includes(index)
        );

        button.setAttribute(
            "aria-pressed",
            selectedAnswers.includes(index)
        );
    });
}

function checkAnswer() {
    if (answered) {
        goToNextQuestion();
        return;
    }

    const q = questions[currentQuestion];

    if (q.type === "fill") {
        const input = document.getElementById("fill-answer");
        const userAnswer = input.value.trim().toLowerCase();

        if (!userAnswer) {
            feedback.textContent = "Please enter your answer first.";
            feedback.className = "feedback error";
            input.focus();
            return;
        }

        selectedAnswers = [userAnswer];
    } else if (selectedAnswers.length === 0) {
        feedback.textContent = "Please select an answer first.";
        feedback.className = "feedback error";
        return;
    }

    answered = true;

    let isCorrect = false;

    if (q.type === "single") {
        isCorrect = selectedAnswers[0] === q.answer;
    } else if (q.type === "multi") {
        const user = [...selectedAnswers].sort((a, b) => a - b);
        const correct = [...q.answer].sort((a, b) => a - b);

        isCorrect =
            user.length === correct.length &&
            user.every((value, index) => value === correct[index]);
    } else {
        isCorrect = q.answer.some(
            answer => answer.toLowerCase() === selectedAnswers[0]
        );
    }

    if (isCorrect) {
        score += POINTS_PER_QUESTION;
        correctCount++;

        feedback.textContent = `✓ Correct! ${q.explanation}`;
        feedback.className = "feedback success";
    } else {
        let correctAnswer;

        if (q.type === "fill") {
            correctAnswer = q.answer[0];
        } else if (q.type === "multi") {
            correctAnswer = q.answer
                .map(index => q.options[index])
                .join(", ");
        } else {
            correctAnswer = q.options[q.answer];
        }

        feedback.textContent =
            `✗ Incorrect. Correct answer: ${correctAnswer}. ${q.explanation}`;

        feedback.className = "feedback error";
    }

    currentScore.textContent = score;

    showAnswerReview(q);

    nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? "View Results →"
            : "Next Question →";
}

function showAnswerReview(q) {
    if (q.type === "fill") {
        document.getElementById("fill-answer").disabled = true;
        return;
    }

    const buttons = answerArea.querySelectorAll(".option");

    buttons.forEach((button, index) => {
        button.disabled = true;

        const isCorrectOption =
            q.type === "multi"
                ? q.answer.includes(index)
                : q.answer === index;

        if (isCorrectOption) {
            button.classList.add("correct");
        } else if (selectedAnswers.includes(index)) {
            button.classList.add("wrong");
        }
    });
}

function goToNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const totalQuestions = questions.length;
    const maxScore = totalQuestions * POINTS_PER_QUESTION;
    const wrongCount = totalQuestions - correctCount;
    const percentage = Math.round((score / maxScore) * 100);
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    document.getElementById("final-score").textContent =
        `${score} / ${maxScore}`;

    document.getElementById("percentage").textContent =
        `${percentage}% score`;

    document.getElementById("result-progress").style.width =
        `${percentage}%`;

    document.getElementById("correct-count").textContent = correctCount;
    document.getElementById("wrong-count").textContent = wrongCount;
    document.getElementById("accuracy").textContent = `${accuracy}%`;

    const title = document.getElementById("result-title");
    const message = document.getElementById("result-message");

    if (percentage >= 80) {
        title.textContent = "Excellent Work! 🎉";
        message.textContent = "Outstanding! You have a great understanding.";
    } else if (percentage >= 50) {
        title.textContent = "Good Job! 👏";
        message.textContent = "Well done! Keep practising to improve.";
    } else {
        title.textContent = "Keep Learning! 💪";
        message.textContent = "Practice makes progress. Try again!";
    }
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", checkAnswer);
restartBtn.addEventListener("click", startQuiz);