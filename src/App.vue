<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import HeaderVue from './components/Header.vue';
import AsideVue from './components/Aside.vue';
import BreadcrumbVue from "./components/Breadcrumb.vue";
import { onBeforeMount, ref } from 'vue';

var asideDefaultActive = ref('/')
onBeforeMount(() => {
    asideDefaultActive.value = window.location.pathname
    console.log('asideDefaultActive:' + asideDefaultActive);
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

</script>

<!-- <template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template> -->


<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <HeaderVue />
            </el-header>

            <el-container>
                <AsideVue :isCollapse="asideCollapse" :defaultActive="asideDefaultActive" />
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



<!-- <style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->
