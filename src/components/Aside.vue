<template>
    <!--
    <el-radio-group style="margin-bottom: 20px; margin-top: 20px;">
        <el-radio-button :label="false">expand</el-radio-button>
        <el-radio-button :label="true">collapse</el-radio-button>
    </el-radio-group> -->

    <el-menu :default-active="defaultActive" class="el-menu-vertical-aside" :collapse="props.isCollapse"
        @open="handleOpen" @close="handleClose" router>
        <el-menu-item index="/">
            <el-icon>
                <IconHome />
            </el-icon>
            <template #title>Index</template>
        </el-menu-item>
        <el-menu-item index="/scheduling">
            <el-icon>
                <IconCalendar />
            </el-icon>
            <template #title>排程管理</template>
        </el-menu-item>
        <!-- <el-menu-item index="/about">
            <el-icon>
                <IconInfo />
            </el-icon>
            <template #title>about</template>
        </el-menu-item> -->
    </el-menu>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import {
    HomeFilled as IconHome,
    Menu as IconMenu,
    Expand as IconExpand,
    Fold as IconFlod,
    InfoFilled as IconInfo,
    Calendar as IconCalendar,
} from '@element-plus/icons-vue'


const props = defineProps(['isCollapse', 'defaultActive'])

// var isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

</script>

<style>
.el-menu-vertical-aside {
    min-height: 400px;
}
.el-menu-vertical-aside:not(.el-menu--collapse) {
    width: 200px;
}
</style>