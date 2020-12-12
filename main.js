const title = document.getElementById('title');
const genreAndDifficulty = document.getElementById('genreAndDifficulty');
const questionBox = document.getElementById('questionBox');
const questionDisplay = document.getElementById('questionDisplay');
const startBtn = document.getElementById('startBtn');
let questionCount = 1;

const questionGenre = [];

startBtn.addEventListener('click', () => {
    title.textContent = '取得中';
    questionDisplay.textContent = '少々お待ちください';
    startBtn.remove();

    setTimeout(() => {
        genreAndDifficultyCreateElement();
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
            console.log(questionGenre);
        });
};

const genreAndDifficultyCreateElement = (() => {
    title.textContent = '問題' + questionCount;
    const genre = document.createElement('p');
    genre.textContent = '[ジャンル]' + questionGenre[0].category;
    genreAndDifficulty.appendChild(genre);
    const difficulty = document.createElement('p');
    difficulty.textContent = '[難易度]' + questionGenre[0].difficulty;
    genreAndDifficulty.appendChild(difficulty);
    questionDisplay.textContent = questionGenre[0].question;
});


onload = (() => {
    questionDataFetch();
})