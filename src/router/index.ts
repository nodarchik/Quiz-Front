import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue';
import QuizView from '../views/QuizView.vue';
import ResultsView from '../views/ResultsView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Login',
            component: LoginView,
        },
        {
            path: '/home',
            name: 'Home',
            component: HomeView,
        },
        {
            path: '/quiz/:sessionId',
            name: 'Quiz',
            component: () => import('../views/QuizView.vue')
        },
        {
            path: '/results/:sessionId',
            name: 'Results',
            component: () => import('../views/ResultsView.vue')
        }
    ]
})

export default router
