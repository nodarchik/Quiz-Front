import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue';
import QuizView from '../views/QuizView.vue';
import ResultsView from '../views/ResultsView.vue';
import AdminView from '../views/AdminView.vue';
import CreateQuoteView  from '../views/CreateQuoteView.vue'
import QuestionnairesView  from '../views/QuestionnairesView.vue'
import EditQuoteView from '../views/EditQuoteView.vue'
import TopScorersView from "@/views/TopScorersView.vue";

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
            component: QuizView,
        },
        {
            path: '/results/:sessionId',
            name: 'Results',
            component: ResultsView,
        },
        {
            path: '/admin',
            name: 'Admin',
            component: AdminView,
        },
        {
            path: '/createquote',
            name: 'CreateQuote',
            component: CreateQuoteView,
        },
        {
            path: '/questionnaires',
            name: 'QuestionnairesView',
            component: QuestionnairesView,
        },
        {
            path: '/edit-quote/:quoteId',
            name: 'EditQuote',
            component:EditQuoteView
        },
        {
            path: '/top-scorers',
            name: 'TopScorers',
            component: TopScorersView
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: 'Home' }
        }
    ]
})

export default router
