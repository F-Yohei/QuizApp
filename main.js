const title = document.getElementById('title');
const genreAndDifficulty = document.getElementById('genreAndDifficulty');
const questionDisplay = document.getElementById('questionDisplay');
const startBtn = document.getElementById('startBtn');
const answerButtonView = document.getElementById('answerButtonView');

const questions = [];
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
    }, 1500);
});


//fetchしてきた問題文を空の配列questionsに追加する関数
fetch('https://opentdb.com/api.php?amount=10')
    .then(response => response.json())
    .then(json => {
        for (let i = 0; i < json.results.length; i++) {
            questions.push(json.results[i]);
        }
    });


//ジャンルを表示するエレメントの作成
const genreCreateElement = (() => {
    title.textContent = '問題' + `${questionCount + 1}`;
    const genre = document.createElement('h3');
    genre.textContent = '[ジャンル]' + questions[questionCount].category;
    return genre;
});


//難易度を表示するエレメントの作成と問題文を更新する処理関数
const difficultyCreateElement = (() => {
    const difficulty = document.createElement('h3');
    difficulty.textContent = '[難易度]' + questions[questionCount].difficulty;
    questionDisplay.innerHTML = questions[questionCount].question;
    return difficulty;
});


//作成したジャンルと難易度のエレメントをappendChildで表示させる関数
const displayView = (() => {
    genreAndDifficultyReset();
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
};


//回答ボタンを初期化する為の関数
const answerButtonReset = (() => {
    while (answerButtonView.firstChild) {
        answerButtonView.removeChild(answerButtonView.firstChild);
    }
});


//ジャンルと難易度を初期化する為の関数
const genreAndDifficultyReset = (() => {
    while (genreAndDifficulty.firstChild) {
        genreAndDifficulty.removeChild(genreAndDifficulty.firstChild);
    }
});


//正誤判定をする為の関数
const answerCheck = ((e) => {
    if (e.target.textContent === questions[questionCount].correct_answer) {
        score++;
        questionCount++
    } else {
        questionCount++
    }
});


//現在、何問目かを監視し問題がまだあれば次のクイズを表示し
//最後の問題を回答したらスコアが表示されるようにする関数
const showScore = (() => {
    if (questionCount < questions.length) {
        displayView();
        createAnswerButton();
    } else if (questionCount === 10) {
        title.textContent = `あなたの正答数は${score}です！！`;
        questionDisplay.textContent = '再度チャレンジしたい場合は以下をクリック！！';
        answerButtonReset();
        genreAndDifficultyReset();
        resetBtn();
    }
});


//回答ボタンを生成しHTMLへ表示
const createAnswerButton = (() => {

    //問題の正解を配列questionsから抽出し配列answersへ格納
    //問題の不正解を配列questionsから抽出し配列answersへ格納
    answers.push(questions[questionCount].correct_answer);
    questions[questionCount].incorrect_answers.forEach((incorrect_answer) => {
        answers.push(incorrect_answer);
    });

    shuffle(answers);
    answerButtonReset();

    //回答ボタンを生成しHTMLに表示する。
    answers.forEach((answer) => {
        const answerBtn = document.createElement('button');
        answerBtn.classList.add('btnstyle');
        answerBtn.innerHTML = answer;
        answerButtonView.appendChild(answerBtn);

        //クリックイベントで回答ボタンが押されたら正誤判定を行い
        //最後の問題まで出題されたらスコアを表示
        answerBtn.addEventListener('click', (e) => {
            answerCheck(e);
            showScore();
        });
    });
    answers.length = 0;
});