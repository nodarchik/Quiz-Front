<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Create Question</h2>
    <form @submit.prevent="submitQuestion" class="border p-4 rounded shadow">
      <div class="mb-3">
        <label for="quote" class="form-label">Question:</label>
        <input type="text" id="quote" v-model="question.quote" class="form-control" required maxlength="255" placeholder="Enter your question here">
      </div>
      <div class="mb-4">
        <label for="type" class="form-label">Type:</label>
        <select id="type" v-model="question.type" class="form-select" required>
          <option value="binary">Binary (Yes/No)</option>
          <option value="multiple_choice">Multiple Choice</option>
        </select>
      </div>
      <div class="answers-container">
        <h4 class="mb-3">Answers:</h4>
        <div v-for="(answer, index) in answers" :key="index" class="mb-3 answer-group">
          <div class="input-group">
            <input type="text" v-model="answer.answer" class="form-control" placeholder="Answer text" required maxlength="255">
            <button @click.prevent="removeAnswer(index)" class="btn btn-outline-danger">Remove</button>
          </div>
          <div class="form-check mt-2">
            <input type="radio" :id="`answer-${index}`" :name="`correct-answer`" class="form-check-input" :value="index" v-model="correctAnswerIndex">
            <label class="form-check-label" :for="`answer-${index}`">Correct answer?</label>
          </div>
        </div>
        <button @click.prevent="addAnswer" class="btn btn-outline-secondary btn-sm mb-3" v-if="canAddMoreAnswers">Add Answer</button>
      </div>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary m-3">Create Question</button>
        <router-link to="/home" class="btn btn-secondary ml-2">Go Home</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const question = ref({ quote: '', type: 'binary' });
const answers = ref([{ answer: '' }]);
const correctAnswerIndex = ref(null);
const error = ref('');

const canAddMoreAnswers = computed(() => {
  return question.value.type === 'binary' ? answers.value.length < 2 : answers.value.length < 3;
});

const addAnswer = () => {
  if (canAddMoreAnswers.value) {
    answers.value.push({ answer: '' });
  }
};

const removeAnswer = (index) => {
  answers.value.splice(index, 1);
};

const submitQuestion = async () => {
  error.value = '';

  // Validation for the minimum number of answers
  const minimumAnswersRequired = question.value.type === 'binary' ? 2 : 3;
  if (answers.value.length < minimumAnswersRequired) {
    error.value = `A ${question.value.type} question requires at least ${minimumAnswersRequired} answers.`;
    return;
  }

  // Validation to ensure at least one answer is marked as correct
  if (correctAnswerIndex.value === null || correctAnswerIndex.value >= answers.value.length) {
    error.value = 'At least one answer must be marked as correct.';
    return;
  }

  try {
    // Create question
    const questionResponse = await axios.post('http://127.0.0.1:8000/api/admin/quotes', question.value, {
      headers: {Authorization: `Bearer ${localStorage.getItem('authToken')}`},
    });
    const questionId = questionResponse.data.data.id;

    // Create answers
    for (const [index, answer] of answers.value.entries()) {
      await axios.post('http://127.0.0.1:8000/api/admin/answers', {
        quote_id: questionId,
        answer: answer.answer,
        is_correct: index === correctAnswerIndex.value,
      }, {
        headers: {Authorization: `Bearer ${localStorage.getItem('authToken')}`},
      });
    }

    // Reset form and provide feedback
    question.value = {quote: '', type: 'binary'};
    answers.value = [{answer: ''}];
    correctAnswerIndex.value = null;
    alert('Question and answers created successfully!');
  } catch (err) {
    error.value = err.response && err.response.data.message ? err.response.data.message : 'An error occurred.';
  }
};


</script>


<style scoped>
.answer-group {
  border: 1px solid #eaeaea;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.input-group button {
  margin-left: 10px;
}

.answers-container h4 {
  padding-left: 10px;
}

.form-check-label {
  margin-left: 5px;
}

.form-check-input {
  margin-top: 0.3rem;
}

</style>