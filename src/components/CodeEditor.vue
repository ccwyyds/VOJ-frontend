<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 500px; height: 75vh"
  />
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import {
  onMounted,
  ref,
  withDefaults,
  defineProps,
  watch,
  onBeforeUnmount,
} from "vue";

interface Props {
  value: string;
  language: string;
  handleChange: (v: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "java",
  handleChange: (v: string) => {
    console.log("code change:", v);
  },
});

const codeEditorRef = ref<HTMLDivElement>();
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

/**
 * 创建 monaco 编辑器实例
 */
const createEditor = () => {
  if (!codeEditorRef.value) return;

  // 销毁旧的
  if (editor) {
    editor.dispose();
  }

  editor = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    lineNumbers: "on",
    automaticLayout: true,
    colorDecorators: true,
    minimap: { enabled: true },
    readOnly: false,
    theme: "vs-dark",
  });

  // 绑定内容变化监听
  editor.onDidChangeModelContent(() => {
    props.handleChange(editor!.getValue());
  });
};

const updateEditorLanguage = (language: string) => {
  if (editor) {
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
  }
};

// 监听语言变化 => 重新创建编辑器
watch(
  () => props.language,
  (newLang) => {
    updateEditorLanguage(newLang);
  }
);

// 初次加载
onMounted(() => {
  createEditor();
});

// 页面卸载时销毁
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
  }
});
</script>

<style scoped></style>
