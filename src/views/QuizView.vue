<template>
  <div class="quiz-container mt-5" v-if="quizData && currentQuestion">
    <div class="timer" v-if="timerSeconds > 0">
      Time left: {{ minutes }}:{{ secondsFormatted }}
    </div>
    <div class="card">
      <div class="card-header">
        <h3>{{ currentQuestion.quote }}</h3>
      </div>
      <div class="card-body">
        <ul class="list-unstyled">
          <li v-for="answer in currentQuestion.answers" :key="answer.id" class="form-check">
            <input class="form-check-input" type="radio" :id="`answer-${answer.id}`" :name="`question-${currentQuestion.id}`" :value="answer.id" v-model="selectedAnswer">
            <label class="form-check-label" :for="`answer-${answer.id}`">
              {{ answer.answer }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    <button class="btn btn-primary mt-3" @click="submitAnswer" v-if="timerSeconds > 0">Submit Answer</button>
    <p v-if="feedback" class="mt-2">{{ feedback }}</p>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const quizData = ref({ quotes: [] });
const currentQuestionIndex = ref(0);
const selectedAnswer = ref('');
const feedback = ref('');
const sessionId = route.params.sessionId;
const token = localStorage.getItem('authToken');

const quizDurationSeconds = 5*60; // 5 minutes in seconds
let intervalId;

// Timer logic
const timerSeconds = ref(quizDurationSeconds);

const minutes = computed(() => Math.floor(timerSeconds.value / 60));
const secondsFormatted = computed(() => `0${timerSeconds.value % 60}`.slice(-2));

function resetTimer() {
  timerSeconds.value = quizDurationSeconds;
  sessionStorage.removeItem(`quizEndTime-${sessionId}`);
  startTimer();
}

function startTimer() {
  const storedEndTime = sessionStorage.getItem(`quizEndTime-${sessionId}`);
  const endTime = storedEndTime ? parseInt(storedEndTime, 10) : Date.now() + quizDurationSeconds * 1000;
  sessionStorage.setItem(`quizEndTime-${sessionId}`, endTime.toString());

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const timeLeft = Math.round((endTime - currentTime) / 1000);
    timerSeconds.value = timeLeft;

    if (timerSeconds.value <= 0) {
      clearInterval(intervalId);
      finishQuiz();
    }
  }, 1000);
}

onUnmounted(() => clearInterval(intervalId));

async function fetchQuizData(sessionId) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/quiz/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Filter out questions without answers
    const filteredQuotes = response.data.quotes.filter(quote => quote.answers && quote.answers.length > 0);
    quizData.value = { ...response.data, quotes: filteredQuotes };

    resetTimer();
  } catch (error) {
    console.error('Error fetching quiz data:', error.response.data);
  }
}

async function finishQuiz() {
  clearInterval(intervalId);
  sessionStorage.removeItem(`quizEndTime-${sessionId}`);
  try {
    await axios.post(`http://127.0.0.1:8000/api/quiz/end/${sessionId}`, {}, {headers: {Authorization: `Bearer ${token}`}});
    router.push(`/results/${sessionId}`);
  } catch (error) {
    console.error('Error finishing quiz:', error.response.data);
  }
}

const submitAnswer = async () => {
  if (!selectedAnswer.value) return; // Ensure an answer is selected
  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/quiz/${sessionId}/answer`, {
      quote_id: currentQuestion.value.id,
      answer_id: selectedAnswer.value,
    }, {headers: {Authorization: `Bearer ${token}`}});
    feedback.value = response.data.message;
    if (currentQuestionIndex.value < quizData.value.quotes.length - 1) {
      currentQuestionIndex.value++;
      selectedAnswer.value = '';
      feedback.value = '';
    } else {
      finishQuiz();
    }
  } catch (error) {
    console.error('Error submitting answer:', error.response.data);
    feedback.value = 'An error occurred. Please try again.';
  }
};

const currentQuestion = computed(() => quizData.value ? quizData.value.quotes[currentQuestionIndex.value] : null);

if (sessionId) {
  fetchQuizData(sessionId);
}

onMounted(startTimer);
</script>
