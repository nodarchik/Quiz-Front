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
            <input class="form-check-input" type="radio" :id="`answer-${answer.id}`"
                   :name="`question-${currentQuestion.id}`" :value="answer.id" v-model="selectedAnswer">
            <label class="form-check-label" :for="`answer-${answer.id}`">
              {{ answer.answer }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-3 d-flex justify-content-between">
      <button class="btn btn-primary" @click="submitAnswer">Submit Answer</button>
      <button class="btn btn-secondary" @click="goToNextQuestionOrFinish" :disabled="!answerSubmitted">
        {{ canGoToNextQuestion ? 'Next Question' : 'Finish Quiz' }}
      </button>
      <router-link to="/home" class="btn btn-secondary ml-2 mx-2">Go Home</router-link>
    </div>
    <p v-if="feedback" class="mt-2">{{ feedback }}</p>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const quizData = ref({ quotes: [] });
const currentQuestionIndex = ref(0);
const selectedAnswer = ref('');
const feedback = ref('');
const sessionEnded = ref(false);
const sessionId = route.params.sessionId;
const token = localStorage.getItem('authToken');
const quizDurationSeconds = 5*60; // 5 minutes in seconds
let intervalId;
// Timer logic
const timerSeconds = ref(quizDurationSeconds);
const minutes = computed(() => Math.floor(timerSeconds.value / 60));
const secondsFormatted = computed(() => `0${timerSeconds.value % 60}`.slice(-2));
const answerSubmitted = ref(false);

function resetTimer() {
  if (sessionEnded.value) {
    return;
  }

  const storedEndTime = sessionStorage.getItem(`quizEndTime-${sessionId}`);
  if (storedEndTime) {
    const endTime = parseInt(storedEndTime, 10);
    const currentTime = Date.now();
    const timeLeft = Math.round((endTime - currentTime) / 1000);
    timerSeconds.value = timeLeft > 0 ? timeLeft : 0;
  } else {
    timerSeconds.value = quizDurationSeconds;
  }

  startTimer();
}

function startTimer() {
  clearInterval(intervalId); // Clear existing interval
  const storedEndTime = sessionStorage.getItem(`quizEndTime-${sessionId}`);
  const endTime = storedEndTime ? parseInt(storedEndTime, 10) : Date.now() + quizDurationSeconds * 1000;
  sessionStorage.setItem(`quizEndTime-${sessionId}`, endTime.toString());

  intervalId = setInterval(async () => {
    const currentTime = Date.now();
    timerSeconds.value = Math.round((endTime - currentTime) / 1000);

    if (timerSeconds.value <= 0) {
      clearInterval(intervalId);
      if (!sessionEnded.value) {
        // If the session is not ended, submit the answer
        await submitAnswer();
        finishQuiz();
      }
    }
  }, 1000);
}

onUnmounted(() => clearInterval(intervalId));

async function fetchQuizData(sessionId) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/quiz/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    quizData.value = response.data;
    if (quizData.value.session && quizData.value.session.ended_at) {
      sessionEnded.value = true;
      router.push(`/results/${sessionId}`);
      return;
    }
    resetTimer();
  } catch (error) {
    console.error('Error fetching quiz data:', error.response ? error.response.data : error.message);
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
    answerSubmitted.value = true;
  } catch (error) {
    console.error('Error submitting answer:', error.response.data);
    if (error.response && error.response.data && error.response.data.message) {
      feedback.value = error.response.data.message;
    } else {
      feedback.value = 'An error occurred. Please try again.';
    }
  }
};
const goToNextQuestionOrFinish = () => {
  if (currentQuestionIndex.value < quizData.value.quotes.length - 1) {
    goToNextQuestion();
  } else {
    finishQuiz();
  }
};
async function finishQuiz() {
  sessionEnded.value = true; // Mark the session as ended
  try {
    await axios.post(`http://127.0.0.1:8000/api/quiz/end/${sessionId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    router.push(`/results/${sessionId}`);
  } catch (error) {
    console.error('Error finishing quiz:', error.response ? error.response.data : error.message);
    feedback.value = 'An error occurred finishing the quiz. Please try again.';
  }
}

const goToNextQuestion = () => {
  if (currentQuestionIndex.value < quizData.value.quotes.length - 1) {
    currentQuestionIndex.value++;
    selectedAnswer.value = null;
    feedback.value = '';
    answerSubmitted.value = false;
  } else {
    finishQuiz();
  }
};
const canGoToNextQuestion = computed(() => {
  return currentQuestionIndex.value < quizData.value.quotes.length - 1;
});
const currentQuestion = computed(() => quizData.value ? quizData.value.quotes[currentQuestionIndex.value] : null);

if (sessionId) {
  fetchQuizData(sessionId);
}

onMounted(startTimer);
</script>
