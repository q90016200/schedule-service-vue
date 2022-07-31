<template>
    <el-row>
        <el-col :span="4" :offset="20">
            <el-button type="primary" :icon="DocumentAdd">新增</el-button>
        </el-col>
    </el-row>
    <el-form>
        <el-table :data="tableData" height="250" style="width: 100%">
            <el-table-column prop="id" label="Id" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="date" label="Date" />
        </el-table>
    </el-form>
</template>

<script setup >
import {
    DocumentAdd,
} from '@element-plus/icons-vue'
import { reactive, onBeforeMount } from 'vue';
import { queryJob } from '../apis/api.js'

var data = reactive({})

onBeforeMount(() => {
    queryJob().then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
})




</script>

<style>
.el-row {
    margin-bottom: 20px;
}
</style>