<template>
    <el-row @click="handleClick">
        <el-icon v-if="asideCollapse" size="20px">
            <IconExpand />
        </el-icon>
        <el-icon v-else size="20px">
            <IconFlod />
        </el-icon>
    </el-row>

</template>

<script setup>
import {
    Fold as IconFlod,
    Expand as IconExpand,
} from '@element-plus/icons-vue'
const emit = defineEmits(['handleAsideCollapse'])
const props = defineProps(['asideCollapse']);

const handleClick = () => {
    console.log('handleClick');
    emit('handleAsideCollapse')
}
</script>