<template>
  <div class="container mt-5 mb-3 me-5">
    <h1>Select Quiz Mode</h1>
    <div class="mt-3">
      <button @click="startQuiz('binary')" class="btn btn-primary me-2">Binary (Yes/No)</button>
      <button @click="startQuiz('multiple_choice')" class="btn btn-secondary">Multiple Choice</button>
    </div>
  </div>
  <div class="container mt-5 mb-3">
    <h1>Select Action</h1>
    <div class="mt-3">
      <button v-if="isAdmin" @click="goToAdminPage" class="btn btn-danger me-2">Go to Admin Page</button>
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import {useRouter} from 'vue-router';
import {computed} from 'vue';

const router = useRouter();

const isAdmin = computed(() => {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin';
});

const startQuiz = async (mode: string) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
        'http://127.0.0.1:8000/api/quiz/start',
        {mode},
        {headers: {Authorization: `Bearer ${token}`}}
    );
    console.log('Quiz started successfully:', response.data);
    if (response.data.session && response.data.session.id) {
      router.push(`/quiz/${response.data.session.id}`);
    } else {
      console.error('Session ID not found in response:', response.data);
    }
  } catch (error) {
    console.error('Error starting quiz:', error.response.data);
  }
};
const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.post(
        'http://127.0.0.1:8000/api/user/logout',
        {},
        {headers: {Authorization: `Bearer ${token}`}}
    );
    // Clear local storage or session storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    // Redirect to login page
    await router.push('/');
  } catch (error) {
    console.error('Error logging out:', error.response.data);
    // Handle error, maybe clear storage and redirect anyway
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    await router.push('/');
  }
};
const goToAdminPage = () => {
  router.push('/admin');
};
</script>