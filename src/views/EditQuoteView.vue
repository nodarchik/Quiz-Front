<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Edit Quote</h2>
    <form @submit.prevent="submitQuestion" class="border p-4 rounded shadow">
      <div class="mb-3">
        <label for="quote" class="form-label">Quote:</label>
        <input type="text" id="quote" v-model="question.quote" class="form-control" required maxlength="255" placeholder="Enter your quote here">
      </div>
      <div class="answers-container">
        <h4 class="mb-3">Answers:</h4>
        <div v-for="(answer, index) in answers" :key="index" class="mb-3 answer-group">
          <div class="input-group mb-2">
            <input type="text" v-model="answer.answer" class="form-control" placeholder="Answer text" required maxlength="255">
            <button @click.prevent="removeAnswer(index)" class="btn btn-outline-danger">Remove</button>
          </div>
          <div class="form-check">
            <input type="checkbox" :id="`isCorrect-${index}`" class="form-check-input" v-model="answer.is_correct">
            <label class="form-check-label" :for="`isCorrect-${index}`">Is Correct?</label>
          </div>
        </div>
        <button @click.prevent="addAnswer" class="btn btn-outline-secondary btn-sm">Add Answer</button>
      </div>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary m-3">Update Quote</button>
        <router-link to="/home" class="btn btn-secondary ml-2">Go Home</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

interface Answer {
  id?: number;
  answer: string;
  is_correct: boolean;
}

const router = useRouter();
const route = useRoute();
const quoteId = route.params.quoteId;
const question = ref({ quote: '' });
const answers = ref<Answer[]>([]);
const error = ref('');

const fetchQuestionAndAnswers = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    error.value = 'Authentication token is not available.';
    return;
  }
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/admin/questionnaires/${quoteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    question.value.quote = response.data.data.quote; // Update to match the response structure
    if (response.data.data.answers) { // Update to match the response structure
      answers.value = response.data.data.answers.map((a: any) => ({
        id: a.id,
        answer: a.answer,
        // If is_correct is not provided in the response, default it to false
        is_correct: a.is_correct ?? false
      }));
    }
  } catch (err) {
    error.value = 'Failed to fetch quote and answers.';
    console.error(err);
  }
};

const addAnswer = () => {
  answers.value.push({ answer: '', is_correct: false });
};

const removeAnswer = (index: number) => {
  answers.value.splice(index, 1);
};

const submitQuestion = async () => {
  error.value = '';
  const token = localStorage.getItem('authToken');
  if (!token) {
    error.value = 'Authentication token is not available.';
    return;
  }

  // Check if at least one answer is marked as correct
  if (!answers.value.some(answer => answer.is_correct)) {
    error.value = 'At least one answer must be marked as correct.';
    return;
  }

  try {
    // Update the quote
    await axios.put(`http://127.0.0.1:8000/api/admin/quotes/${quoteId}`, {
      quote: question.value.quote,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update answers individually
    for (const answer of answers.value) {
      if ('id' in answer && answer.id !== undefined) { // Check if the answer has an ID, indicating it exists
        await axios.put(`http://127.0.0.1:8000/api/admin/answers/${answer.id}`, {
          quote_id: quoteId, // Include the quote_id here
          answer: answer.answer,
          is_correct: answer.is_correct ? 1 : 0, // Convert boolean to integer
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    // Provide user feedback and navigation after successful update
    alert('Quote and answers updated successfully!');
    router.push('/some-success-page'); // Adjust navigation as needed
  } catch (err) {
    error.value = 'An error occurred while updating the quote and answers.';
    console.error(err);
  }
};


onMounted(fetchQuestionAndAnswers);
</script>

<style scoped>
.input-group {
  display: flex;
  align-items: center;
}
.input-group .form-control {
  margin-right: 0.5rem;
}
.form-check {
  user-select: none; /* This will prevent text selection on double click */
}
</style>
