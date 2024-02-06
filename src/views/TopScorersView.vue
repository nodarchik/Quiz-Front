<template>
  <div class="container mt-5">
    <div class="mb-4 text-center">
      <router-link to="/home" class="btn btn-secondary ml-2 mx-2">Go Home</router-link>
      <h2 >Top Scorers</h2>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="loading" class="text-center"><span>Loading...</span></div>
    <table v-if="!loading && scorers.length > 0" class="table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Total Score</th>
        <th scope="col">Time Used</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(scorer, index) in scorers" :key="index">
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ scorer.first_name }} {{ scorer.last_name }}</td>
        <td>{{ scorer.email }}</td>
        <td>{{ scorer.total_score }}</td>
        <td>{{ scorer.total_time }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const scorers = ref([]);
const error = ref('');
const loading = ref(false);

const fetchTopScorers = async () => {
  loading.value = true;
  error.value = '';
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/user/top-scorers', {
      headers: { Authorization: `Bearer ${token}` }
    });
    scorers.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch top scorers.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTopScorers);
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
