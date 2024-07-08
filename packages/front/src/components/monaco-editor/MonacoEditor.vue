<template>
  <slot></slot>
  <div class="editor-container" ref="container"></div>
</template>

<script setup lang="ts">
import { KeyCode, KeyMod, Range, editor } from 'monaco-editor'
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
  loadLocalCode,
  saveLocalCode,
} from './constant'

export interface EditorProps {
  // 代码
  modelValue: string
  // 主题
  theme?: string
  lang: LanguageName
  fontFamily?: string
  fontSize?: number
  // 用于重置代码模板
  resetCode?: number
  // 代码保存的 key 的前缀，完整的 key 还需要拼上语言
  codeStoragePreKey?: string
}

const container = ref<HTMLElement | null>(null)

const props = defineProps<EditorProps>()
const {
  modelValue: code,
  theme,
  lang,
  fontFamily,
  fontSize,
  resetCode,
} = toRefs(props)
const { codeStoragePreKey } = props
const codeTemplate = { ...LANGUAGE_CODE_TEMPLATE_MAP }
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const codeEditor = editor.create(container.value as HTMLElement, {
    value: code.value || '// code here...',
    language: LANGUAGE_TYPE_MAP[lang.value],
    theme: theme.value || '',
    fontFamily: fontFamily.value || 'ui-monospace',
    fontSize: fontSize.value || 16,
    automaticLayout: true,
    tabCompletion: 'on',
    tabSize: 4,
    scrollbar: {
      verticalScrollbarSize: 10,
    },
  })

  // ctrl+s 保存时自动格式化全部代码
  codeEditor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, async () => {
    codeEditor.getAction('editor.action.formatDocument')?.run()
  })

  codeEditor.onDidChangeModelContent(() => {
    emit('update:modelValue', codeEditor.getValue())
  })

  // 选中的行背景设为灰色，没选中的恢复默认色
  codeEditor.onDidChangeCursorPosition((e) => {
    const value = codeEditor.createDecorationsCollection([
      {
        range: new Range(e.position.lineNumber, 1, e.position.lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'selected-line',
        },
      },
    ])

    console.log(value)
    setTimeout(() => {
      value.clear()
    }, 1000)
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
    const oldCode = (codeTemplate[oldLang] = codeEditor.getValue())
    if (codeStoragePreKey) {
      saveLocalCode(codeStoragePreKey, oldLang, oldCode)
    }
    // 切换语言
    editor.setModelLanguage(
      codeEditor.getModel() as editor.ITextModel,
      LANGUAGE_TYPE_MAP[newLang] || 'cpp',
    )
    // 更新模板
    let newCode = ''
    if (codeStoragePreKey) {
      newCode =
        loadLocalCode(codeStoragePreKey, newLang) || codeTemplate[newLang]
    }
    codeEditor.setValue(newCode)
  })

  if (!code.value) {
    codeEditor.setValue(
      loadLocalCode(codeStoragePreKey || '', lang.value) ||
        codeTemplate[lang.value],
    )
  }

  // resetCode 变换了就还原到默认的代码模板
  watch(resetCode, () => {
    codeEditor.setValue(LANGUAGE_CODE_TEMPLATE_MAP[lang.value])
  })

  if (codeStoragePreKey) {
    timer = setInterval(() => {
      saveLocalCode(codeStoragePreKey, lang.value, codeEditor.getValue())
    }, 1000)
  }
})

onBeforeUnmount(() => {
  editor.getModels().forEach((model) => {
    model.dispose()
  })

  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
}
</style>
<style>
.selected-line {
  background-color: #f0f0f0;
}
</style>
