<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header bg-primary text-white">Register</div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="mb-3">
                <label for="firstName" class="form-label">First Name</label>
                <input type="text" class="form-control" id="firstName" v-model="user.first_name" required maxlength="255">
              </div>
              <div class="mb-3">
                <label for="lastName" class="form-label">Last Name</label>
                <input type="text" class="form-control" id="lastName" v-model="user.last_name" required maxlength="255">
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" v-model="user.email" required maxlength="255">
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="user.password" required minlength="8">
              </div>
              <div class="mb-3">
                <label for="passwordConfirmation" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="passwordConfirmation" v-model="user.password_confirmation" required>
              </div>
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              <button type="submit" class="btn btn-primary">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const user = ref({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    const error = ref('');

    const register = async () => {
      try {
        const token = localStorage.getItem('authToken');
        await axios.post('http://127.0.0.1:8000/api/admin/register', user.value, {
          headers: { Authorization: `Bearer ${token}` }
        });
        router.push('/login');
      } catch (err) {
        if (err.response && err.response.data) {
          error.value = err.response.data.message;
        } else {
          error.value = 'An unexpected error occurred.';
        }
      }
    };

    return {
      user,
      error,
      register
    };
  },
});
</script>

<style scoped>
.card-header {
  font-size: 1.25rem;
}
</style>
