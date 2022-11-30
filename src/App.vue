<script setup>
import HeaderVue from './components/Header.vue';
import AsideVue from './components/Aside.vue';
import BreadcrumbVue from "./components/Breadcrumb.vue";
import { onBeforeMount, ref } from 'vue';
import { useDark, useToggle } from '@vueuse/core'

var asideDefaultActive = ref('/')
onBeforeMount(() => {
    asideDefaultActive.value = window.location.pathname
    console.log(asideDefaultActive.value);
})

// 監聽 aside 是否展開
var asideCollapse = ref(true);
const handleAsideCollapse = () => {
    if (asideCollapse.value) {
        asideCollapse.value = false;
    } else {
        asideCollapse.value = true;
    }
}

// 處理
const isDark = useDark()

</script>

<template>
    <div class="common-layout">
        <el-container style="height: calc(100vh - 76px)">
           <AsideVue :isCollapse="asideCollapse" :defaultActive="asideDefaultActive" />
            <el-container>
                <el-header>
                    <HeaderVue />
                </el-header>
                <el-main>
                    <BreadcrumbVue :asideCollapse="asideCollapse" @handleAsideCollapse="handleAsideCollapse" />
                    <el-divider />
                    <!-- 路由切換 -->
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>