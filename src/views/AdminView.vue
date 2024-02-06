<template>
  <div class="container mt-5">
    <h2>Quiz History</h2>
    <div class="mb-3">
      <router-link to="/createquote" class="btn btn-success me-2">Create Quote</router-link>
      <router-link to="/questionnaires" class="btn btn-warning me-2">Edit Quote</router-link>
      <router-link to="/Home" class="btn btn-primary me-2">Back to Home</router-link>
      <router-link to="/registration" class="btn btn-primary me-2">Registration</router-link>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Total Score</th>
          <th>Unanswered Questions</th>
          <th>Quiz Submit Date / Time</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="history in quizHistory" :key="history.id">
          <td>{{ history.user.first_name }}</td>
          <td>{{ history.user.last_name }}</td>
          <td>{{ history.user.email }}</td>
          <td>{{ history.score }}</td>
          <td>{{ history.unanswered_questions }}</td>
          <td>{{ history.ended_at }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const quizHistory = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/admin/quiz/history', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    quizHistory.value = response.data;
  } catch (error) {
    console.error('Error fetching quiz history:', error.response.data);
  }
});
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
