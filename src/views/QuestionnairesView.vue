<template>
  <!-- Binary and Multiple Choice Questionnaires Section -->
  <div class="container mt-5">
    <div class="mb-4 text-center">
      <h2 >Edit Questionnaires</h2>
      <router-link to="/home" class="btn btn-secondary ml-2 mx-2">Go Home</router-link>
    </div>


    <div class="row">
      <!-- Binary Questions Section (Left Column) -->
      <div class="col-md-6">
        <h3 class="mb-3">Binary Questions</h3>
        <!-- Display Binary Questionnaires -->
        <div v-for="questionnaire in binaryQuestionnaires" :key="questionnaire.id" class="card mb-3">
          <div class="card-header">
            <h4>{{ questionnaire.quote }}</h4>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li v-for="answer in questionnaire.answers" :key="answer.id" class="list-group-item">{{ answer.answer }}</li>
            </ul>
          </div>
          <div class="card-footer text-end">
            <button @click="editQuestionnaire(questionnaire.id)" class="btn btn-primary me-2">Edit</button>
            <button @click="removeQuestionnaire(questionnaire.id)" class="btn btn-danger">Remove</button>
          </div>
        </div>
        <button @click="previousPage('binary')" class="btn btn-secondary mx-2">Previous</button>
        <button @click="nextPage('binary')" class="btn btn-secondary mx-2">Next</button>
      </div>

      <!-- Multiple Choice Questions Section (Right Column) -->
      <div class="col-md-6">
        <h3 class="mb-3">Multiple Choice Questions</h3>
        <!-- Display Multiple Choice Questionnaires -->
        <div v-for="questionnaire in multipleChoiceQuestionnaires" :key="questionnaire.id" class="card mb-3">
          <div class="card-header">
            <h4>{{ questionnaire.quote }}</h4>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li v-for="answer in questionnaire.answers" :key="answer.id" class="list-group-item">{{ answer.answer }}</li>
            </ul>
          </div>
          <div class="card-footer text-end">
            <button @click="editQuestionnaire(questionnaire.id)" class="btn btn-primary me-2">Edit</button>
            <button @click="removeQuestionnaire(questionnaire.id)" class="btn btn-danger">Remove</button>
          </div>
        </div>
        <button @click="previousPage('multiple_choice')" class="btn btn-secondary mx-2">Previous</button>
        <button @click="nextPage('multiple_choice')" class="btn btn-secondary mx-2">Next</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted, computed} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const binaryQuestionnaires = ref([]);
const multipleChoiceQuestionnaires = ref([]);
const pageSize = 2;
const binaryPage = ref(0);
const multipleChoicePage = ref(0);

const fetchBinaryQuestionnaires = async (page = 1) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`http://127.0.0.1:8000/api/admin/questionnaires?pagination=${pageSize}&page=${page}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    binaryQuestionnaires.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch binary questionnaires:', error);
  }
};

const fetchMultipleChoiceQuestionnaires = async (page = 1) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`http://127.0.0.1:8000/api/admin/questionnaires?pagination=${pageSize}&page=${page}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    multipleChoiceQuestionnaires.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch multiple choice questionnaires:', error);
  }
};

const nextPage = async (type) => {
  if (type === 'binary') {
    binaryPage.value++;
    await fetchBinaryQuestionnaires(binaryPage.value);
  } else if (type === 'multiple_choice') {
    multipleChoicePage.value++;
    await fetchMultipleChoiceQuestionnaires(multipleChoicePage.value);
  }
};

const previousPage = async (type) => {
  if (type === 'binary' && binaryPage.value > 0) {
    binaryPage.value--;
    await fetchBinaryQuestionnaires(binaryPage.value);
  } else if (type === 'multiple_choice' && multipleChoicePage.value > 0) {
    multipleChoicePage.value--;
    await fetchMultipleChoiceQuestionnaires(multipleChoicePage.value);
  }
};

onMounted(() => {
  fetchBinaryQuestionnaires();
  fetchMultipleChoiceQuestionnaires();
});

const editQuestionnaire = (id) => {
  router.push({ name: 'EditQuote', params: { quoteId: id } });
};

const removeQuestionnaire = async (quoteId) => {
  try {
    const token = localStorage.getItem('authToken');
    await axios.delete(`http://127.0.0.1:8000/api/admin/quotes/${quoteId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    console.log(`Quote with ID ${quoteId} deleted successfully.`);
    // Optionally, refresh the list after deletion
    await fetchBinaryQuestionnaires(binaryPage.value);
    await fetchMultipleChoiceQuestionnaires(multipleChoicePage.value);
  } catch (error) {
    console.error(`Failed to delete quote with ID ${quoteId}:`, error);
  }
};

</script>


<style>
.questionnaire {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
