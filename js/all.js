document.addEventListener('keydown', (event) => {
            if (event.shiftKey) {
                const key = event.key.toLowerCase();

                if (key === 'h') {
                    window.location.href = 'index.html';
                }
            }
        }
    )
    // 出題
let reverseMode = false;

// シャッフル
function shuffleArray(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

let shuffled = shuffleArray(list);
let index = 0;
let n = 0;
let mistakes = [];

// 切替ボタン生成
const modeBtn = document.createElement("button");
modeBtn.id = "toggleMode";
modeBtn.textContent = "英語→意味";
document.body.insertBefore(
    modeBtn,
    document.getElementById("question")
);

modeBtn.addEventListener("click", () => {
    reverseMode = !reverseMode;

    modeBtn.textContent =
        reverseMode
            ? "英語→意味"
            : "意味→英語";

    showQuestion();
});

// 問題表示
function showQuestion() {
    const quiz = shuffled[index];

    document.getElementById('result').textContent = '';

    document.getElementById('question').textContent =
        reverseMode
            ? quiz.answer
            : quiz.quiz;

    let choices = [
        reverseMode
            ? quiz.quiz
            : quiz.answer
    ];

    while (choices.length < 4) {

        const item =
            list[Math.floor(Math.random() * list.length)];

        const pick =
            reverseMode
                ? item.quiz
                : item.answer;

        if (!choices.includes(pick)) {
            choices.push(pick);
        }
    }

    choices = shuffleArray(choices);

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    choices.forEach(choice => {

        const btn = document.createElement('button');

        btn.textContent = choice;
        btn.className = 'choice';

        btn.addEventListener('click', () => {
            checkAnswer(choice);
        });

        choicesDiv.appendChild(btn);
    });
}

// 判定
function checkAnswer(selected) {

    const correct =
        reverseMode
            ? shuffled[index].quiz
            : shuffled[index].answer;

    const result =
        document.getElementById('result');

    document.querySelectorAll('.choice').forEach(btn => {
        btn.disabled = true;
    });

    if (selected === correct) {

        result.innerHTML =
            '<span class="correct">正解！</span>';

        index++;

        if (index < shuffled.length) {

            setTimeout(() => {
                showQuestion();
            }, 500);

        } else {

            setTimeout(() => {

                document.getElementById('question').textContent = '';
                document.getElementById('choices').innerHTML = '';

                result.innerHTML =
                    '<span class="correct">全問クリア！</span>';

                let reviewText =
                    "不正解の数：" + n + "回";

                if (mistakes.length > 0) {

                    reviewText +=
                        "\n\n【間違えた単語一覧】\n\n" +
                        mistakes
                            .map(item =>
                                `${item.quiz} ： ${item.answer}`
                            )
                            .join("\n");

                } else {

                    reviewText +=
                        "\n\n全問ノーミス！";

                }

                alert(reviewText);

            }, 500);
        }

    } else {

        n++;

        if (!mistakes.some(
            item => item.quiz === shuffled[index].quiz
        )) {
            mistakes.push({
                quiz: shuffled[index].quiz,
                answer: shuffled[index].answer
            });
        }

        result.innerHTML =
            `<span class="incorrect">不正解</span><br>正解：${correct}`;

        document.querySelectorAll('.choice').forEach(btn => {

            if (btn.textContent === correct) {

                btn.style.backgroundColor = '#4CAF50';
                btn.style.color = 'white';

            }

        });

        setTimeout(() => {

            document.querySelectorAll('.choice').forEach(btn => {
                btn.disabled = false;
            });

        }, 500);

    }
}

// 初期表示
showQuestion();