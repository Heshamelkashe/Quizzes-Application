// Select Elements
let quiz_Info = document.querySelector('.quiz_info'),
    container_Area = document.querySelector('.container-area'),
    steps_Quiz = document.querySelector('.steps-quiz'),
    totalCountQuestion = document.querySelector('.quiz_info .count .total-count'),
    theNumberQuiz = document.querySelector('.quiz_info .count .handle-count'),
    bulletsSpansContainer = document.querySelector('.bullets'),
    quizArea = document.querySelector('.quiz-area'),
    answerArea = document.querySelector('.answers-area'),
    answers = document.getElementsByName('question'),
    buttonSubmit = document.querySelector('#submit_answer');

 // Set Options
let currentIndex = 0,
    answerRight = 0,
    countQuiz = 1,
    countDownTime,
    fullNameUser;

window.onload = () => {
    document.querySelector("#userName").focus()
}

// Check Full Name on User
document.querySelector('.openQuiz').onclick = () => {

    // get Full name on the user
    let inputUserName = document.querySelector("#userName");
    let user_Name = document.querySelector("#userName").value;
    let massageSpan = document.querySelector(".mas_user")

    // check the the input 
    if (user_Name != "" && user_Name.length > 8 ) {
        fullNameUser = user_Name;
        document.querySelector('.info-User').remove()

        // show the Quiz
        setTimeout(() => {
            quiz_Info.style.display = "flex";
            container_Area.style.display = "block";
            steps_Quiz.style.display = "flex";
            getQuestions();
        },1000)
    } else if (user_Name.length < 8 && user_Name.length > 0 ) {
        inputUserName.focus()
        inputUserName.className="active"
        massageSpan.textContent = "the name is not the full name";
        massageSpan.style.color = "#ef1b1b";
        massageSpan.style.display = "block";
    } else {
        inputUserName.focus()
        inputUserName.className="active"
        massageSpan.textContent = "enter your full name";
        massageSpan.style.color = "#ef1b1b";
        massageSpan.style.display = "block";
    }
}

// The Function is Request Data From the Data pas
function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200)
        {
            let questionObject = JSON.parse(this.responseText);
            let questionCount = questionObject.length;

             // add Question Data 
            addQuestionData(questionObject[currentIndex],questionCount)

             // create Bullets
            createBullets(questionCount)

            // start count time 
            countTime(15, questionCount);

            // check button submit
            buttonSubmit.onclick = () => {

                // get Right Answer 
                let RightAnswer = questionObject[currentIndex].right_answer;
                    
                // check Answer
                checkAnswer(RightAnswer, questionCount);

                // Remove and add now Question
                setTimeout(() => {

                    // Remove Previous Question
                    quizArea.innerHTML = '';
                    answerArea.innerHTML = '';

                    // add Question Data 
                    addQuestionData(questionObject[currentIndex], questionCount)
                    
                    // add class Bullets
                    handlerBullets()

                    // add + the number for number Quiz
                    theNumberQuiz.textContent = countQuiz;

                    showResult(questionCount)
                }, 500)
                
                // stop the interval count time and start
                answers.forEach(ans => {
                    if (ans.checked) {
                        clearInterval(countDownTime)
                        countTime(15, questionCount);
                    }
                })
            

            }

        }    
    }
    myRequest.open("GET","data/html_questions.json", true)
    myRequest.send()
}

// Create Answer Div and Add Button to Inside 
function addQuestionData(obj, count) {

    if (currentIndex < count) {
        //  crate h2 Question
        let quizH2 = document.createElement('h2');
        // add data in h2 title
        quizH2.appendChild(document.createTextNode(obj.title));
        quizArea.appendChild(quizH2);

        // create Answer
        for (let i = 1; i <= 4; i++) {

            // create div
            let mineDiv = document.createElement("div");

            // add class on main div
            mineDiv.className = 'answer';
            
            // create button answer
            let checkInput = document.createElement('input');

            // add Type + Id + name +  data from Input
            checkInput.name="question"
            checkInput.type = "radio";
            checkInput.id = `answer_${i}`;
            checkInput.dataset.answer = obj[`answer_${i}`];

            // create label and  add text label 
            let label = document.createElement("label");
            label.htmlFor = `answer_${i}`;
            label.textContent = obj[`answer_${i}`];

            // add answer Button to main div
            mineDiv.appendChild(checkInput);

            // add answer Button to main div
            mineDiv.appendChild(label);
            // add main Div to answer Area
            answerArea.appendChild(mineDiv)

        }  
    }
}

// Check Answer Input 
function checkAnswer(rAnswer, count) {
    
    answers.forEach(ans => {

        // get data attribute
        let data = ans.dataset.answer; 
        
        if (ans.checked) {
            if (rAnswer === data) {
                answerRight++
                ans.parentElement.style.background = "green";
                ans.parentElement.style.color ="white"
            } else {
                ans.parentElement.style.background = "red";
                ans.parentElement.style.color = "white";
            } 

            // check currentIndex = count or not
            if (currentIndex < count) {
                    currentIndex++;                
            }

            // add the number Quiz
            if (countQuiz < count ) {
                countQuiz++
            }
        } 
        
    })
}

//  Create Bullets
function createBullets(num) {

    //  add the total questions
    totalCountQuestion.textContent = num;

    // text the numbers Questions
    theNumberQuiz.textContent = countQuiz;
    
    for (let n = 0; n < num; n++)
    {
        // create Bullets
        let bullets = document.createElement('span');

        // Append span in Bullets container 
        bulletsSpansContainer.appendChild(bullets);

        // check first bullets
        if (n === 0)
        {
            bullets.classList.add('active')
        }
    }
}

// Add Class Active From Bullets
function handlerBullets() {
    let bullets = document.querySelectorAll('.bullets span');
    bullets.forEach((span, countSpans) => {
        if (currentIndex === countSpans) {
            span.className = "active";
        }
    })
}

// Show Result Container
function showResult(count) {
    let resultIcon;
    let iconColor;
    let theResultText;
    let score;

    if (currentIndex === count) {
        // Remove They Are Containers
        container_Area.remove()
        steps_Quiz.remove()

        // Show The Results
        if (answerRight > count / 2 && answerRight < count) {
            resultIcon = ' <i class="fa-solid fa-circle-check"></i> ';
            iconColor = "green"
            theResultText = "congratulation, you passed !";
            score = "85%";
        } else if (answerRight === count) {
            resultIcon = ' <i class="fa-solid fa-circle-check"></i>';
            iconColor = "green"
            theResultText = "congratulation, you passed !";
            score = "100%";
        } else {
            resultIcon = '<i class="fa-solid fa-circle-xmark"></i>';
            iconColor = "red"
            theResultText ="You Failed The Exam !";
            score = "60%";
        }

        // Show The Container Result
        document.querySelector('.result').style.display = "flex";

        // Add the Text In h3 And Score
        document.querySelector('.result h3').textContent = theResultText;
        document.querySelector('.result .score').textContent = score;

        // Add The Icon Result
        document.querySelector('.result .icon').innerHTML = resultIcon;
        document.querySelector('.result .icon').style.color = iconColor;
        document.querySelector('.result .result-name').textContent = fullNameUser;
        
    }
}

// Create Count Down Time 
function countTime(duration, count) {
    if (currentIndex < count) {
        let minute, second;
        countDownTime = setInterval(() => {
            minute = parseInt(duration / 60);
            second = parseInt(duration % 60);

            minute = minute < 10 ? `0${minute}` : minute;
            second = second < 10 ? `0${second}` : second;

            document.querySelector('.count-down .time').textContent = `${minute} : ${second}`;

            if (--duration < 0) {
                clearInterval(countDownTime)
                document.querySelector('#answer_1').checked = true;
                buttonSubmit.click()
            }
        },1000)
    }
    
}