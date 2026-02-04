let failCount = 0;

const GIFS = {
    success: 'https://media1.tenor.com/m/ovs7WC7Y95oAAAAd/wili-wili-wili-wili-n9i.gif',
    wrong: 'https://media1.tenor.com/m/V_v0yiGn6LcAAAAd/wrong-not-right.gif',
    terry: 'https://media1.tenor.com/m/IKIz5CqRHaAAAAAd/terry-crews-im-gonna-miss-you.gif'
};

const MESSAGES = {
    success: '🎉 CORRECT! You know the culture! 🇲🇦',
    wrong: '❌ Wrong answer! Try again...',
    terry: '😭 Terry is disappointed in you...'
};

// Allow pressing Enter to submit
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
});

function checkAnswer() {
    const input = document.getElementById('answer-input');
    const answer = input.value.trim().toLowerCase();
    
    if (answer === '') {
        input.style.borderColor = '#ff6b6b';
        input.placeholder = 'Please type something!';
        setTimeout(() => {
            input.style.borderColor = '#00d4ff';
            input.placeholder = 'Type your answer...';
        }, 1500);
        return;
    }
    
    if (answer === 'n9i') {
        // Correct answer!
        showResult('success');
    } else {
        // Wrong answer
        failCount++;
        
        if (failCount >= 2) {
            // Two consecutive failures - show Terry
            showResult('terry');
        } else {
            // First failure
            showResult('wrong');
        }
    }
}

function showResult(type) {
    const questionSection = document.getElementById('question-section');
    const resultSection = document.getElementById('result-section');
    const resultGif = document.getElementById('result-gif');
    const resultMessage = document.getElementById('result-message');
    const mainGif = document.getElementById('main-gif');
    
    // Hide question, show result
    questionSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    // Set the appropriate GIF and message
    resultGif.src = GIFS[type];
    resultMessage.textContent = MESSAGES[type];
    
    // Remove all message classes and add the appropriate one
    resultMessage.className = '';
    if (type === 'success') {
        resultMessage.classList.add('success-message');
        mainGif.style.display = 'none';
    } else if (type === 'terry') {
        resultMessage.classList.add('terry-message');
        mainGif.style.display = 'none';
    } else {
        resultMessage.classList.add('fail-message');
        mainGif.style.display = 'none';
    }
}

function resetQuiz() {
    const questionSection = document.getElementById('question-section');
    const resultSection = document.getElementById('result-section');
    const mainGif = document.getElementById('main-gif');
    const input = document.getElementById('answer-input');
    const attempts = document.getElementById('attempts');
    
    // Reset fail count
    failCount = 0;
    
    // Show question, hide result
    questionSection.style.display = 'block';
    resultSection.style.display = 'none';
    mainGif.style.display = 'block';
    
    // Clear input and attempts
    input.value = '';
    attempts.textContent = '';
}
