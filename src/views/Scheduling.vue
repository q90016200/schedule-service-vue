<template>
  <el-row :gutter="10">
    <el-col :span="1">
      <el-button :icon="Refresh" @click="fetchNewJobs()" :loading="jobsData.loading" />
    </el-col>
    <el-col :span="4" :offset="19">
      <el-button type="primary" :icon="DocumentAdd" @click="handleJobFormAdd()">新增</el-button>
    </el-col>
  </el-row>

  <el-form>
    <el-table :data="filterjobsData" height="250" style="width: 100%">
      <el-table-column prop="id" label="id" sortable />
      <el-table-column prop="name" label="name" />
      <!-- <el-table-column prop="cron" label="cron" /> -->
      <el-table-column prop="status" label="status" sortable />
      <el-table-column label="Operations">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search name"
          />
        </template>
        <template #default="scope">
          <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button> -->
          <el-button
            size="small"
            @click="handleJobFormEditDelete(scope.$index, scope.row, 'edit')"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleJobFormEditDelete(scope.$index, scope.row, 'delete')"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-form>

  <div class="pt-2"></div>
  <!-- <el-button text @click="dialogVisible = true">click to open the Dialog</el-button> -->

  <!-- 新增/編輯 燈箱 start -->
  <el-dialog v-model="dialogJob.visible" :title="dialogJob.method">
    <el-form label-width="100px" :model="jobForm" style="max-width: 500px">
      <el-form-item label="name">
        <el-input
          v-model="jobForm.name"
          type="text"
          show-word-limit
          maxlength="100"
          required="required"
        />
      </el-form-item>
      <el-form-item label="path">
        <el-input
          v-model="jobForm.path"
        />
      </el-form-item>
      <el-form-item label="cron">
        <cron-element-plus
          v-model="jobForm.cron"
          :periods="cronInputConfig.periods"
          :button-props="{ type: 'primary' }"
        />
        <el-input
          v-model="jobForm.cron"
          type="text"
          show-word-limit
          maxlength="30"
        />
      </el-form-item>
      <el-form-item label="status">
        <el-switch
          v-model="dialogJob.form_status.status"
          active-text="running"
          inactive-text="stopped"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogJob.visible = false">Cancel</el-button>
        <el-button type="primary" @click="handleJobFormConfirm"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- 新增/編輯 燈箱 end -->
</template>

<script setup >
import { Refresh,DocumentAdd } from "@element-plus/icons-vue";
import QS from "qs";
import { ref, reactive, computed, watch, onBeforeMount } from "vue";
import { queryJob, addJob, editJob, delJob } from "../apis/api.js";

const jobsData = reactive({
  value: [],
  loading: false
});
const jobForm = reactive({
  id: 0,
  name: "",
  cron: "* * * * *",
  path: "",
  status: "",
})
const dialogJob = reactive(
  {
    "visible": false,
    "method": "add",
    "form": jobForm,
    "form_status": {
      "status":false
    }
  }
)

// 依照搜尋文字顯示對應資料 name
const search = ref("");
const filterjobsData = computed(() =>
  jobsData.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const cronInputConfig = {
  periods: [
    { id: "week", value: ["dayOfWeek", "hour", "minute"] },
    { id: "day", value: ["hour", "minute"] },
    { id: "hour", value: ["minute"] },
    { id: "minute", value: [] },
  ],
};

onBeforeMount(() => {
  fetchNewJobs();
});

watch(dialogJob.form_status, () => {
  dialogJob.form_status.status === true
    ? (jobForm.status = "running")
    : (jobForm.status = "stopped");
});

function fetchNewJobs() {
  jobsData.loading = true
  queryJob()
    .then((res) => {
      jobsData.value = res.data.data;
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      setTimeout(() => {
        jobsData.loading = false
      }, 200);
    });
}

const handleJobFormAdd = () => {
  dialogJob.visible = true;
  dialogJob.method = "add";

  jobForm.id = 0;
  jobForm.name = "";
  jobForm.path = "";
  jobForm.cron = "* * * * *";
  jobForm.status = "stopped";
  dialogJob.form_status.status = false;
};

const handleJobFormEditDelete = (index, row, method) => {
  dialogJob.visible = true;
  dialogJob.method = method;

  jobForm.id = row.id;
  jobForm.name = row.name;
  jobForm.path = row.path;
  jobForm.cron = row.cron;
  switch (row.status) {
    case "running":
      dialogJob.form_status.status = true;
      break;
    default:
      dialogJob.form_status.status = false;
      break;
  }

  // console.log(index)
  // console.log(row)
};

const handleJobFormConfirm = () => {
  dialogJob.visible = false;

  if (dialogJob.method == "add") {
    let data = QS.stringify({
      name: jobForm.name,
      method: "http",
      cron: jobForm.cron,
      path: jobForm.path,
    });
    addJob(data)
      .then((res) => {
        console.log(res.data);
        fetchNewJobs();
      })
      .catch((err) => {
        console.log(err);
      })
  } else if (dialogJob.method == "edit") {
    let data = QS.stringify({
      status: jobForm.status,
      name: jobForm.name,
      method: "http",
      cron: jobForm.cron,
      path: jobForm.path,
    });

    editJob(jobForm.id, data)
      .then((res) => {
        console.log(res.data);
        fetchNewJobs();
      })
      .catch((err) => {
        console.log(err);
      })
  } else if (dialogJob.method == "delete") {
    delJob(jobForm.id)
      .then((res) => {
        console.log(res.data);
        fetchNewJobs();
      })
      .catch((err) => {
        console.log(err);
      })
  }
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
</style>