<template>
  <div class="editor-container" ref="container"></div>
</template>

<script setup lang="ts">
import { KeyCode, KeyMod, editor } from 'monaco-editor'
import { onBeforeUnmount, onMounted, ref, toRefs, watchEffect } from 'vue'
import './worker'

export interface EditorProps {
  modelValue?: string
  theme?: string
  lang?: string
  fontFamily?: string
  fontSize?: number
}

const container = ref<HTMLElement | null>(null)

const props = defineProps<EditorProps>()
const { modelValue, theme, lang, fontFamily, fontSize } = toRefs(props)
const emit = defineEmits(['update:modelValue'])

onMounted(() => {
  const codeEditor = editor.create(container.value as HTMLElement, {
    value: modelValue.value || '// code here...',
    language: lang.value,
    theme: theme.value || '',
    fontFamily: fontFamily.value || 'ui-monospace',
    fontSize: fontSize.value || 16,
    automaticLayout: true,
    tabCompletion: 'on',
    tabSize: 4,
  })

  // ctrl+s 保存时自动格式化全部代码
  codeEditor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, async () => {
    codeEditor.getAction('editor.action.formatDocument')?.run()
  })

  codeEditor.onDidChangeModelContent(() => {
    emit('update:modelValue', codeEditor.getValue())
  })

  watchEffect(() => {
    codeEditor.updateOptions({
      theme: theme.value || '',
      fontFamily: fontFamily.value || 'ui-monospace',
      fontSize: fontSize.value || 16,
      automaticLayout: true,
      tabCompletion: 'on',
      tabSize: 4,
    })
    // 修改语言
    editor.setModelLanguage(
      codeEditor.getModel() as editor.ITextModel,
      lang.value || 'cpp',
    )
  })
})

onBeforeUnmount(() => {
  editor.getModels().forEach((model) => {
    model.dispose()
  })
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
}
</style>
