<template>
  <el-row >
    <el-col :sm="2">
      <el-button :icon="Refresh" @click="fetchNewJobs()" :loading="jobsData.loading" />
    </el-col>
    <el-col :sm="4">
      <el-select v-model="filterJobGroup" clearable placeholder="Select Group">
        <el-option v-for="item in jobGroupOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
    <el-col :sm="{span: 3, offset: 15}">
      <el-button type="primary" :icon="DocumentAdd" @click="handleJobFormAdd()">新增</el-button>
    </el-col>
  </el-row>

  <el-form>
    <el-table ref="refTable" :data="filterJobsData" style="width: 100%" v-loading="jobsData.loading">
      <el-table-column prop="id" label="id" sortable />
      <el-table-column prop="name" label="name" />
      <el-table-column prop="cron" label="cron" />
      <el-table-column prop="group" label="group" sortable>
        <template #default="scope">
          <el-tag v-if="scope.row.group !=''" :type="(scope.row.group === 'dev' ? 'info' : (scope.row.group === 'stage' ? '' : 'danger'))">
            {{ scope.row.group }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="status" sortable>
        <template #default="scope">
          <el-tag :type="scope.row.status === 'running' ? 'success' : 'danger'" >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Operations">
        <template #header>
          <el-input
            v-model="filterJobName"
            size="small"
            placeholder="Type to search name"
          />
        </template>
        <template #default="scope">
          <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button> -->
          <el-button
            size="small"
            type="info"
            @click="handleJobFormEditDelete(scope.$index, scope.row, 'edit')"
            >
            Edit
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleJobFormEditDelete(scope.$index, scope.row, 'delete')"
            >
            Delete
          </el-button>
          <!-- <el-button
            type="warning"
            size="small"
            @click="handleJobFormTrigger(scope.$index, scope.row)"
            >
            Trigger
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </el-form>

  <div class="pt-2"></div>
  <!-- <el-button text @click="dialogVisible = true">click to open the Dialog</el-button> -->

  <!-- 新增/編輯 燈箱 start -->
  <el-dialog v-model="dialogJob.visible" :title="dialogJob.method" >
    <el-form label-width="100px" :model="jobForm" style="max-width: 500px" label-position="top" >
      <el-form-item label="name" >
        <el-input
          v-model="jobForm.name"
          type="text"
          show-word-limit
          maxlength="100"
          required="required"
        />
      </el-form-item>
      <el-form-item label="method">
        <el-radio-group v-model="jobForm.method">
          <el-radio label="http">http</el-radio>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="僅支持呼叫方法，不支持帶入參數"
            placement="top"
          >
            <el-radio label="grpc">gRPC</el-radio>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="jobForm.method == 'grpc'" label="consul">
          <el-input v-model="jobForm.consul" show-word-limit maxlength="255" placeholder="consul://{ip}:{port}/xxxrpc.rpc?wait=30s	"/>
      </el-form-item>

      <el-form-item label="path">
        <el-input v-if="jobForm.method == 'grpc'" v-model="jobForm.path" placeholder="/xxx.xxxrpc/BetLogGrabberAll" />
        <el-input v-if="jobForm.method == 'http'" v-model="jobForm.path" placeholder="http://xxxxxxxx" />
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
          style="margin-top: 10px;"
        />
      </el-form-item>
      <el-form-item label="group">
        <el-select v-model="dialogJob.form.group" clearable placeholder="">
          <el-option v-for="item in jobGroupOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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

  <!-- trigger lightbox start -->
  <el-dialog v-model="dialogJobTrigger.visible" :title="dialogJobTrigger.title" :close-on-click-modal=false>
    <el-form v-if="dialogJobTrigger.progress.status == 'pending'" label-width="100px" style="max-width: 500px" label-position="top">
      <el-form-item label="Path">
        <el-input v-model="dialogJobTrigger.form.path" />
      </el-form-item>
      <el-form-item label="Frequency">
        <el-input-number v-model="dialogJobTrigger.form.frequency" :min="1"/>
      </el-form-item>
      <el-form-item label="Interval (ms)">
        <el-input-number v-model="dialogJobTrigger.form.interval" :min="0" :step="100" />
      </el-form-item>
    </el-form>
    <div class="triggerProgress" v-else style="display: flex;justify-content: center;align-items: center;" >
      <el-progress type="dashboard" :percentage="dialogJobTrigger.progress.precent">
        <template #default="scope">
          <span class="percentage-value">{{dialogJobTrigger.progress.now}}/{{dialogJobTrigger.progress.max}}</span>
          <span class="percentage-label">{{dialogJobTrigger.progress.status}}</span>
        </template>
      </el-progress>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button @click="dialogJobTrigger.visible = false">Cancel</el-button> -->
        <div v-if="dialogJobTrigger.progress.status != 'complete'">
          <el-button color="#626aef" @click="handleJobFormTriggerStop" :disabled="dialogJobTrigger.progress.status !='running'">
            stopped</el-button>
          <el-button type="primary" @click="handleJobFormTriggerExecute" :disabled="dialogJobTrigger.progress.status!='pending'">
            Execute
          </el-button>
        </div>
      </span>
    </template>
  </el-dialog>
  <!-- trigger lightbox end -->

</template>

<script setup >
import { Refresh, DocumentAdd } from "@element-plus/icons-vue";
import QS from "qs";
import { ref, reactive, computed, watch, onBeforeMount } from "vue";
import { queryJob, addJob, editJob, delJob } from "../apis/api.js";
import axios from 'axios'

const refTable = ref()

const jobsData = reactive({
  value: [],
  loading: false
});
const jobForm = reactive({
  id: 0,
  name: "",
  method:"http",
  cron: "* * * * *",
  consul:"",
  path: "",
  group: "",
  status: "stopped",
})

const jobGroupOptions = [
  {
    text: 'dev',
    value: 'dev',
    label: 'dev',
  },
  {
    text: 'stage',
    value: 'stage',
    label: 'stage',
  },
  {
    text: 'prod',
    value: 'prod',
    label: 'prod',
  }
]

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

const dialogJobTrigger = reactive({
  "visible": false,
  "title": "trigger",
  "form": {
    "path": "",
    "frequency": 1,
    "interval": 0,
  },
  "progress": {
    "precent":0,
    "now": 0,
    "max": 0,
    "status": "pending"
  }
})

const filterJobName = ref("");
const filterJobGroup = ref("");

const filterJobsData = computed(() =>
  jobsData.value.filter(
    (data) => {
      let status = false
      if (!filterJobName.value || data.name.toLowerCase().includes(filterJobName.value.toLowerCase())) {
        status = true
      }

      if (filterJobGroup.value != "") {
        if (data.group != filterJobGroup.value) {
          status = false
        }
      }
      // console.log(status)

      return status
    }
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
      }, 300);
    });
}

const handleJobFormAdd = () => {
  dialogJob.visible = true;
  dialogJob.method = "add";

  jobForm.id = 0;
  jobForm.name = "";
  jobForm.method = "http";
  jobForm.consul = "";
  jobForm.path = "";
  jobForm.cron = "* * * * *";
  jobForm.group = "";
  jobForm.status = "stopped";
  dialogJob.form_status.status = false;
};

const handleJobFormEditDelete = (index, row, method) => {
  dialogJob.visible = true;
  dialogJob.method = method;

  jobForm.id = row.id;
  jobForm.name = row.name.trim();
  jobForm.method = row.method;
  if (row.method == "grpc") {
    jobForm.consul = row.consul.trim();
  } else {
    jobForm.consul = "";
  }

  jobForm.path = row.path.trim();
  jobForm.group = row.group;
  jobForm.cron = row.cron;
  jobForm.status = row.status
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
      name: jobForm.name.trim(),
      method: jobForm.method,
      cron: jobForm.cron,
      group: jobForm.group,
      consul: jobForm.consul.trim(),
      path: jobForm.path.trim(),
      status: jobForm.status,
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
      name: jobForm.name.trim(),
      method: jobForm.method,
      consul: jobForm.consul.trim(),
      cron: jobForm.cron,
      group: jobForm.group,
      path: jobForm.path.trim(),
    });
    // console.log(data)

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

const handleJobFormTrigger = (i, row) => {
  dialogJobTrigger.visible = true;
  dialogJobTrigger.form.path = row.path
  dialogJobTrigger.form.frequency = 1
  dialogJobTrigger.form.interval = 1000
  dialogJobTrigger.progress.status = "pending"
}

const handleJobFormTriggerExecute = () => {
  dialogJobTrigger.progress.status = "running"
  dialogJobTrigger.progress.max = dialogJobTrigger.form.frequency
  dialogJobTrigger.progress.now = 0
  dialogJobTrigger.progress.precent = 0

  let path = dialogJobTrigger.form.path
  let interval = dialogJobTrigger.form.interval
  let feq = dialogJobTrigger.form.frequency

  request(path, interval, feq)
}

const handleJobFormTriggerStop = () => {
  dialogJobTrigger.progress.status = "stopped"

}

async function request(path, interval, feq) {
  for (let index = 0; index < feq; index++) {
    if (dialogJobTrigger.progress.status == 'stopped') {
      break
    }
    await axios.get(path).finally(()=>{
      dialogJobTrigger.progress.now = (index + 1)
      let precent = (dialogJobTrigger.progress.now / dialogJobTrigger.progress.max) * 100
      if (precent >= 100) {
        dialogJobTrigger.progress.precent = 100
        setTimeout(() => {
          dialogJobTrigger.progress.status = "completed"
        }, 300);
      } else {
        dialogJobTrigger.progress.precent = precent
      }
    })
    await sleep(interval)
  }
}

async function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}

</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-loading-mask {
  z-index: 9;
}
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>