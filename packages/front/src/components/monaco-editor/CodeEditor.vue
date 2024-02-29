<template>
  <div class="code-editor">
    <div class="tools">
      <el-dropdown @command="changeLanguage" trigger="click">
        <span class="el-dropdown-link">
          {{ lang }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="C">C</el-dropdown-item>
            <el-dropdown-item command="C++">C++</el-dropdown-item>
            <el-dropdown-item command="Java">Java</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tooltip content="还原到默认的代码模板" placement="top" effect="light">
        <!-- 还原到默认的代码模板 -->
        <el-icon class="reset" @click="resetCodeTemplate"
          ><RefreshLeft
        /></el-icon>
      </el-tooltip>
    </div>
    <MonacoEditor
      v-model="code"
      v-bind="{ theme, lang, fontFamily, fontSize, resetCode }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { ArrowDown, RefreshLeft } from '@element-plus/icons-vue'
import MonacoEditor, { EditorProps } from './MonacoEditor.vue'
import { LanguageName } from './constant'

export interface CodeEditorProps extends EditorProps {}

const props = defineProps<CodeEditorProps>()
// 注意：model 绑定的数据比较特殊，不要用 toRefs 转换
const { theme, fontFamily, fontSize } = toRefs(props)
const code = ref(props.modelValue)
const lang = ref(props.lang)
const resetCode = ref(0)
const emit = defineEmits(['update:modelValue', 'update:lang'])

watchEffect(() => {
  emit('update:modelValue', code.value)
  emit('update:lang', lang.value)
})

// 切换语言
const changeLanguage = (command: string) => {
  lang.value = command as LanguageName
}

// 还原到默认的代码模板
const resetCodeTemplate = () => {
  resetCode.value++
}
</script>

<style scoped lang="less">
.code-editor {
  height: 100%;
  width: 100%;

  .tools {
    display: flex;
    gap: 10px;
    align-items: center;
    height: 30px;
    padding-left: 10px;
    margin-bottom: 8px;
    border-bottom: 1px solid #ebeef5;

    .el-dropdown-link {
      padding: 5px 8px;
      border-radius: 3px;
      cursor: pointer;
      color: #606266;
      display: flex;
      align-items: center;
      outline: none;

      &:hover {
        background-color: #f0f0f0;
      }
    }

    .reset {
      margin-top: 1px;
      cursor: pointer;
      color: #606266;
      font-size: 16px;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
