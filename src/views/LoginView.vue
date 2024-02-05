<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-lg p-3 mb-5 bg-white rounded">
      <h5 class="card-header text-center">Login</h5>
      <div class="card-body">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input id="email" v-model="email" type="email" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input id="password" v-model="password" type="password" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Login</button>
          <p class="text-danger">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value,
    });
    // Handle login success
    console.log('Login successful:', response.data);
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('userRole', response.data.user.role);

    router.push('/home');
  } catch (error) {
    console.error('Login error:', error.response.data);
    errorMessage.value = error.response.data.message;
  }
};
</script>
