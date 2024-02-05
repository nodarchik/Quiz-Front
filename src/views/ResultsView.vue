<template>
  <div class="results-container mt-5 container">
    <h2 class="text-center mb-4">Quiz Results</h2>
    <div v-if="session" class="card p-4 shadow-lg">
      <p class="mb-2"><strong>Mode:</strong>
        <span class="text-primary">{{ session.mode }}</span>
      </p>
      <p class="mb-2"><strong>Score:</strong>
        <span class="text-success">{{ session.score }} / {{ session.total_questions }}</span>
      </p>
      <p class="mb-2"><strong>Total Time:</strong>
        <span class="text-info">{{ session.total_time }}</span>
      </p>
      <p class="mb-2"><strong>Unanswered Questions:</strong>
        <span class="text-danger">{{ session.unanswered_questions }}</span>
      </p>
      <div class="text-center mt-4">
        <button class="btn btn-primary" @click="restartQuiz">Restart Quiz</button>
      </div>
    </div>
    <div v-else>
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const session = ref(null);
const token = localStorage.getItem('authToken');

onMounted(async () => {
  const sessionId = route.params.sessionId;
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/quiz/end/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    session.value = response.data; // Assuming the entire object is the session information
  } catch (error) {
    console.error('Error fetching quiz results:', error.response.data);
  }
});

const restartQuiz = () => {
  router.push('/home');
};
</script>
