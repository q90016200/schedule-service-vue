import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Scheduling from "../views/Scheduling.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/scheduling",
        name: "Scheduling",
        component: Scheduling,
    },
    {
        path: "/about",
        name: "About",
        component: About,
    },
];

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
});

export default router;