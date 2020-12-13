const title = document.getElementById('title');
const genreAndDifficulty = document.getElementById('genreAndDifficulty');
const questionDisplay = document.getElementById('questionDisplay');
const startBtn = document.getElementById('startBtn');
const answerButtonView = document.getElementById('answerButtonView');

const questionGenre = [];
const answers = [];

let score = 0;
let questionCount = 0;


//非同期処理を走らせてデータ取得中の画面を表示
startBtn.addEventListener('click', () => {
    title.textContent = '取得中';
    questionDisplay.textContent = '少々お待ちください';
    startBtn.remove();

    setTimeout(() => {
        createAnswerButton();
        displayView();
    }, 2000);
});


//fetchしてきた問題文を空の配列questionGenreに追加する関数
const questionDataFetch = () => {
    fetch('https://opentdb.com/api.php?amount=10')
        .then(response => response.json())
        .then(json => {
            for (i = 0; i < json.results.length; i++) {
                questionGenre.push(json.results[i]);
            }
        });
};


onload = (() => {
    questionDataFetch();
});


//ジャンルを表示するエレメントの作成
const genreCreateElement = (() => {
    title.textContent = '問題' + `${questionCount + 1}`;
    const genre = document.createElement('h3');
    genre.textContent = '[ジャンル]' + questionGenre[questionCount].category;
    return genre;
});


//難易度を表示するエレメントの作成と問題文を更新する処理関数
const difficultyCreateElement = (() => {
    const difficulty = document.createElement('h3');
    difficulty.textContent = '[難易度]' + questionGenre[questionCount].difficulty;
    questionDisplay.innerHTML = questionGenre[questionCount].question;
    return difficulty;
});


//作成したジャンルと難易度のエレメントをappendChildで表示させる関数
const displayView = (() => {
    while (genreAndDifficulty.firstChild) {
        genreAndDifficulty.removeChild(genreAndDifficulty.firstChild);
    }
    genreAndDifficulty.appendChild(genreCreateElement());
    genreAndDifficulty.appendChild(difficultyCreateElement());
});


//最後のクイズまで出題されたらクイズを再チャレンジする為の関数
const resetBtn = (() => {
    const InitializeButton = document.createElement('button');
    InitializeButton.textContent = 'ホームに戻る';
    InitializeButton.classList.add('btnstyle');
    answerButtonView.appendChild(InitializeButton);

    InitializeButton.addEventListener('click', () => {
        score = 0;
        questionCount = 0;
        displayView();
        createAnswerButton();
    });
});

//回答をシャッフルする為の関数
const shuffle = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


const createAnswerButton = (() => {
    answers.push(questionGenre[questionCount].correct_answer);
    questionGenre[questionCount].incorrect_answers.forEach((test) => {
        answers.push(test);
    });

    shuffle(answers);

    while (answerButtonView.firstChild) {
        answerButtonView.removeChild(answerButtonView.firstChild);
    }

    answers.forEach((answer) => {
        const answerBtn = document.createElement('button');
        answerBtn.classList.add('btnstyle');
        answerBtn.innerHTML = answer;
        answerButtonView.appendChild(answerBtn);

        answerBtn.addEventListener('click', (e) => {
            if (e.target.textContent === questionGenre[questionCount].correct_answer) {
                score++;
                questionCount++
            } else {
                questionCount++
            }

            if (questionCount < questionGenre.length) {
                displayView();
                createAnswerButton();
            } else if (questionCount === 10) {
                title.textContent = `あなたの正答数は${score}です！！`;
                questionDisplay.textContent = '再度チャレンジしたい場合は以下をクリック！！';
                while (answerButtonView.firstChild) {
                    answerButtonView.removeChild(answerButtonView.firstChild);
                }
                while (genreAndDifficulty.firstChild) {
                    genreAndDifficulty.removeChild(genreAndDifficulty.firstChild);
                }
                resetBtn();
            }
        });
    });
    answers.length = 0;
});