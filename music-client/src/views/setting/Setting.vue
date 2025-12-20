<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import { HttpManager } from '@/api'
import { useGoto } from '@/composables/goto'
import { useConfigureStore, useUserStore } from '@/store'
import Password from './Password.vue'
import PersonalData from './PersonalData.vue'

const userStore = useUserStore()
const configureStore = useConfigureStore()
const { gotoSignIn } = useGoto()

const userId = computed(() => userStore.userId)

async function cancelAccount() {
  const result = await HttpManager.deleteUser(userId.value)
  ElMessage({
    message: result.message,
    type: result.type,
  })
  gotoSignIn()
  configureStore.setToken(false)
}
</script>

<template>
  <div class="setting">
    <h1>设置</h1>
    <el-tabs tab-position="left">
      <el-tab-pane label="个人资料" class="content">
        <PersonalData />
      </el-tab-pane>
      <el-tab-pane label="更改密码" class="content">
        <Password />
      </el-tab-pane>
      <el-tab-pane label="账号和安全" class="content">
        <el-button type="danger" :icon="Delete" @click="cancelAccount">
          注销账号
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

h1 {
  border-bottom: 1px solid $color-grey;
}

.content {
  padding-top: 20px;
  text-align: center;
}

@media screen and (min-width: $sm) {
  .setting {
    margin: 0 10% 30px;
    padding: 20px;
    min-height: 60vh;
  }
}

@media screen and (max-width: $sm) {
  .setting {
    padding: 20px;
  }
}
</style>
