<template>
    <el-row>
        <el-col :span="4" :offset="20">
            <!-- <el-button type="primary" :icon="DocumentAdd" @click="dialogJobFormVisible = true,jobFormMethod='add'">新增</el-button> -->
            <el-button type="primary" :icon="DocumentAdd" @click="handleJobFormAdd()">新增</el-button>
        </el-col>
    </el-row>
    <el-form>
        <el-table :data="filterTableData" height="250" style="width: 100%">
            <el-table-column prop="id" label="id" sortable />
            <el-table-column prop="name" label="name" />
            <el-table-column prop="cron" label="cron" />
            <el-table-column prop="status" label="status" sortable />
            <el-table-column label="Operations">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
                <template #default="scope">
                    <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button> -->
                    <el-button size="small" @click="handleJobFormEdit(scope.$index, scope.row)">Edit</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-form>

<div class="pt-2">

    <cron-light v-model="cronText" @error="error=$event"></cron-light>
    <div class="text-lightest pt-2">cron expression: {{cronText}}</div>

</div>
    <!-- <el-button text @click="dialogVisible = true">click to open the Dialog</el-button> -->

    <!-- 新增/編輯 燈箱 start -->
    <el-dialog v-model="dialogJobFormVisible" :title="jobFormMethod">
        <el-form  label-width="100px" :model="jobForm" style="max-width: 460px">
            <el-form-item label="name" >
                <el-input v-model="jobForm.name" type="text" show-word-limit maxlength="100" />
            </el-form-item>
            <el-form-item label="path">
                <el-input v-model="jobForm.path" />
            </el-form-item>
            <el-form-item label="cron">
                <el-input v-model="jobForm.cron" type="text" show-word-limit maxlength="30" />
            </el-form-item>
            <el-form-item label="status" >
                <el-switch v-model="jobFormStatus" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogJobFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleJobFormConfirm">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 新增/編輯 燈箱 end -->
</template>

<script setup >
import {
    DocumentAdd,
} from '@element-plus/icons-vue'

import { ref, reactive, computed, watch, onBeforeMount } from 'vue';
import { queryJob } from '../apis/api.js'


const tableData = reactive({value:[]})
// const tableData = reactive([])
// const tableData = ref([])
// const tableData = []
// var tableData = ref()
// tableData = [1,2,3,4]

const search = ref('')
const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const cronText = ref()
const dialogJobFormVisible = ref(false)
const jobFormStatus = ref(false)
const jobFormMethod = ref("add")
const jobForm = reactive({
    "id": 0,
    "name": "",
    "cron": "*/1 * * * *",
    "path": "",
    "status": "",
})

onBeforeMount(() => {
    fetchNewJobs()
})

watch (jobFormStatus, () => {
    // (jobFormStatus.value === true) ? ((jobForm.status = "running"), console.log("running")) : ((jobForm.status = "stopped"), console.log("stopped"))
    (jobFormStatus.value === true) ? ((jobForm.status = "running")) : ((jobForm.status = "stopped"))
})

function fetchNewJobs() {
    queryJob().then(res => {
        // console.log(typeof res.data.data)
        // console.log(res.data.data[0])
        // tableData.value = res.data.data
        tableData.value = res.data.data
        // let jData = JSON.parse(JSON.stringify(res.data.data))

        // console.log(typeof (jData))
        // console.log(jData)
        // tableData = [1,2,3]
    }).catch(err => {
        console.log(err)
    })
}

const handleJobFormAdd = () => {
    dialogJobFormVisible.value = true
    jobFormMethod.value = "add"

    jobForm.id = 0
    jobForm.name = ""
    jobForm.path = ""
    jobForm.cron = "*/1 * * * *"
    jobFormStatus.value = false
}

const handleJobFormEdit = (index, row) => {
    dialogJobFormVisible.value = true
    jobFormMethod.value = "edit"

    jobForm.id = row.id
    jobForm.name = row.name
    jobForm.path = row.path
    jobForm.cron = row.cron
    switch (row.status) {
        case "running":
            jobFormStatus.value = true
            break;
        default:
            jobFormStatus.value = false
            break;
    }

    // console.log(index)
    // console.log(row)
}

const handleJobFormConfirm = () => {
    dialogJobFormVisible.value = false;


}

</script>

<style>
.el-row {
    margin-bottom: 20px;
}
</style>