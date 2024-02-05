import {createRouter, createWebHistory} from "vue-router"
import HomePage from "../views/HomePage.vue";
import CustomErrorPage from "../views/CustomErrorPage.vue";
import CreatePage from '../components/CreatePage.vue';
import editor from '../components/Editor.vue';
import UpdatePage from '../components/UpdatePage.vue';
import LayerOperation from '../components/LayerOperation.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage
        },
        {   
            path: '/image/:imageId', 
            name: "imageEditor",
            component: editor, 
        },
        {   
            path: '/image/:imageId/allLayers', 
            name: "allLayers",
            component: editor, 
        },
        {   
            path: '/layer/:layerId', 
            name: "layerEditor",
            component: editor, 
        },
        {
            path: '/create',
            name: 'Create',
            component: CreatePage
        },
        {
            path: '/update',
            name: 'Update',
            component: UpdatePage
        },
        {
            path: '/image/:imageId/layerOperation',
            name: 'LayerOperation',
            component: LayerOperation
        },
        {
            path: '/errorPage',
            name: 'CustomErrorPage',
            component: CustomErrorPage
        }
    ]
})

export default router