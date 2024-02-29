<template>
  <slot></slot>
  <div class="editor-container" ref="container"></div>
</template>

<script setup lang="ts">
import { KeyCode, KeyMod, editor } from 'monaco-editor'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  toRefs,
  watch,
  watchEffect,
} from 'vue'
import './worker'
import {
  LANGUAGE_CODE_TEMPLATE_MAP,
  LANGUAGE_TYPE_MAP,
  LanguageName,
} from './constant'

export interface EditorProps {
  modelValue: string
  theme?: string
  lang: LanguageName
  fontFamily?: string
  fontSize?: number
  resetCode?: number
}

const container = ref<HTMLElement | null>(null)

const props = defineProps<EditorProps>()
const { modelValue, theme, lang, fontFamily, fontSize, resetCode } =
  toRefs(props)
const emit = defineEmits(['update:modelValue'])
const codeTemplate = { ...LANGUAGE_CODE_TEMPLATE_MAP }

onMounted(() => {
  const codeEditor = editor.create(container.value as HTMLElement, {
    value: modelValue.value || '// code here...',
    language: LANGUAGE_TYPE_MAP[lang.value],
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
  })

  // 修改语言
  watch(lang, (newLang, oldLang) => {
    // 先保存当前语言的代码
    codeTemplate[oldLang] = codeEditor.getValue()
    // 切换语言
    editor.setModelLanguage(
      codeEditor.getModel() as editor.ITextModel,
      LANGUAGE_TYPE_MAP[newLang] || 'cpp',
    )
    // 更新模板
    codeEditor.setValue(codeTemplate[newLang])
  })

  // resetCode 变换了就还原到默认的代码模板
  watch(
    resetCode,
    () => {
      codeEditor.setValue(codeTemplate[lang.value])
    },
    { immediate: true },
  )
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
