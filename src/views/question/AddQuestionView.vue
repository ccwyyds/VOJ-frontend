<template>
  <div id="addQuestionView">
    <a-form
      :model="form"
      style="width: 80vw; padding: 24px"
      @submit="handleSubmit"
      label-position="top"
    >
      <a-form-item field="title" label="题目标题">
        <a-input
          :style="{ width: '100%' }"
          placeholder="请输入标题"
          allow-clear
          :default-value="form.title"
        />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor
          :value="form.content"
          :handle-change="onContentChange"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          :default-value="form.tags"
          :style="{ width: '100%' }"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <CodeEditor
          :value="form.answer"
          :handle-change="onAnswerChange"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item field="answer" label="时间限制">
        <a-input-number
          :style="{ width: '100%' }"
          placeholder="请输入时间限制"
          v-model="form.judgeConfig.timeLimit"
          class="input-demo"
          :min="0"
          :max="1000"
        >
          <template #append> S</template>
        </a-input-number>
      </a-form-item>

      <a-form-item field="answer" label="内存限制">
        <a-input-number
          :style="{ width: '100%' }"
          v-model="form.judgeConfig.memoryLimit"
          placeholder="请输入内存限制"
          class="input-demo"
          :min="0"
          :max="1000"
        >
          <template #append> MB</template>
        </a-input-number>
      </a-form-item>
      <a-form-item field="answer" label="堆栈限制">
        <a-input-number
          :style="{ width: '100%' }"
          placeholder="请输入堆栈限制"
          v-model="form.judgeConfig.stackLimit"
          class="input-demo"
          :min="0"
          :max="1000"
        >
          <template #append> MB</template>
        </a-input-number>
      </a-form-item>

      <a-form-item
        v-for="(judgeCaseItem, index) of form.judgeCase"
        :key="index"
        :label="`测试用例-${index + 1}`"
      >
        <div style="display: flex; gap: 10px; align-items: center">
          <a-textarea
            v-model="judgeCaseItem.input"
            placeholder="输入用例"
            style="width: 200px"
          />

          <a-textarea
            v-model="judgeCaseItem.output"
            placeholder="输出用例"
            style="width: 200px"
          />

          <a-button
            @click="handleDelete(index)"
            style="margin-left: 10px"
            status="danger"
          >
            删除
          </a-button>
        </div>
      </a-form-item>

      <!-- 按钮区域：右下角对齐 -->
      <div
        style="display: flex; justify-content: space-evenly; margin-top: 20px"
      >
        <!-- 左侧：添加测试用例 -->
        <a-button @click="handleAdd" status="success">添加测试用例</a-button>

        <!-- 右侧：提交按钮 -->
        <a-button type="primary" @click="handleSubmit" style="min-width: 100px"
          >提交
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  title: "A + B",
  content: "内容1",
  tags: ["队列", "简单"],
  answer: "答案1",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "1 2 1",
      output: "3 4 1",
    },
  ],
});
const handleSubmit = async () => {
  const res = await QuestionControllerService.addQuestionUsingPost(form);
  if (res.code === 0) {
    message.success("添加成功");
  } else {
    message.error("添加失败," + res.message);
  }
};

const onAnswerChange = (v: string) => {
  form.answer = v;
};

const onContentChange = (v: string) => {
  form.content = v;
};
const handleAdd = () => {
  form.judgeCase.push({
    input: "",
    output: "",
  });
};

const handleDelete = (index: number) => {
  form.judgeCase.splice(index, 1);
};
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
</script>

<style scoped>
#addQuestionView {
  display: flex;
  width: 100vw;
  justify-content: flex-start;
}
</style>
