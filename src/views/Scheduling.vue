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
                    <el-button size="small" @click="handleJobFormEditDelete(scope.$index, scope.row, 'edit')">Edit</el-button>
                    <el-button size="small" type="danger" @click="handleJobFormEditDelete(scope.$index, scope.row, 'delete')">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-form>

<div class="pt-2">



</div>
    <!-- <el-button text @click="dialogVisible = true">click to open the Dialog</el-button> -->

    <!-- 新增/編輯 燈箱 start -->
    <el-dialog v-model="dialogJobFormVisible" :title="jobFormMethod">
        <el-form  label-width="100px" :model="jobForm" style="max-width: 500px">
            <el-form-item label="name" >
                <el-input v-model="jobForm.name" type="text" show-word-limit maxlength="100" />
            </el-form-item>
            <el-form-item label="path">
                <el-input v-model="jobForm.path" />
            </el-form-item>
            <el-form-item label="cron">
                <CronLight v-model="jobForm.cron" :periods="cronLightConfig.periods"></CronLight>
                <el-input v-model="jobForm.cron" type="text" show-word-limit maxlength="30" disabled/>
            </el-form-item>
            <el-form-item label="status" >
                <el-switch v-model="jobFormStatus" active-text="running" inactive-text="stopped" />
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
import QS from 'qs';
import { ref, reactive, computed, watch, onBeforeMount } from 'vue';
import { queryJob, addJob, editJob, delJob } from '../apis/api.js'

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

const dialogJobFormVisible = ref(false)
const jobFormStatus = ref(false)
const jobFormMethod = ref("add")
const jobForm = reactive({
    "id": 0,
    "name": "",
    "cron": "* * * * *",
    "path": "",
    "status": "",
})

const cronLightConfig = {
    periods: [
        { id: 'week', value: ['dayOfWeek', 'hour', 'minute'] },
        { id: 'day', value: ['hour', 'minute'] },
        { id: 'hour', value: ['minute'] },
        { id: 'minute', value: [] },
    ]
}

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
    jobForm.cron = "* * * * *"
    jobForm.status = "stopped"
    jobFormStatus.value = false
}

const handleJobFormEditDelete = (index, row, method) => {
    dialogJobFormVisible.value = true
    jobFormMethod.value = method

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

    if (jobFormMethod.value == "add") {
        let data = QS.stringify({
            "name": jobForm.name,
            "method": "http",
            "cron": jobForm.cron,
            "path": jobForm.path,
        })
        addJob(data).then(res => {
            console.log(res.data)
            fetchNewJobs()
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            // dialogJobFormVisible.value = true
        })
    } else if (jobFormMethod.value == "edit") {
        let data = QS.stringify({
            "status": jobForm.status,
            "name": jobForm.name,
            "method": "http",
            "cron": jobForm.cron,
            "path": jobForm.path,
        })

        editJob(jobForm.id, data).then(res => {
            console.log(res.data)
            fetchNewJobs()
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            // dialogJobFormVisible.value = true
        })
    } else if (jobFormMethod.value == "delete") {
        delJob(jobForm.id).then(res => {
            console.log(res.data)
            fetchNewJobs()
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            // dialogJobFormVisible.value = true
        })
    }
}

</script>

<style>
.el-row {
    margin-bottom: 20px;
}
</style>