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
          v-model="form.title"
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
          v-model="form.tags"
          :style="{ width: '100%' }"
          placeholder="请输入标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor
          :value="form.answer"
          :handle-change="onAnswerChange"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item field="judgeConfig.timeLimit" label="时间限制">
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

      <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
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
      <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
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
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import { useRoute, useRouter } from "vue-router";

const form = ref({
  title: "",
  content: "",
  tags: [],
  answer: "",
  judgeConfig: {
    memoryLimit: 1,
    stackLimit: 1,
    timeLimit: 1,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

//区分添加和更新页面
const route = useRoute();
const router = useRouter();
const updatePage = route.path.includes("update");
//获取当前要修改的题目，把数据渲染到页面
/**
 * 根据题目 id 获取老的数据
 */
const updateData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    Object.assign(form.value, res.data);
    console.log(form.value);
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1,
        stackLimit: 1,
        timeLimit: 1,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};
const handleSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
      await router.push({ path: "/questions" });
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

const onAnswerChange = (v: string) => {
  form.value.answer = v;
};

const onContentChange = (v: string) => {
  form.value.content = v;
};
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

const handleDelete = (index: any) => {
  form.value.judgeCase.splice(index, 1);
};

onMounted(() => {
  updateData();
  console.log(form.value);
});
</script>

<style scoped>
#addQuestionView {
  display: flex;
  width: 100vw;
  justify-content: flex-start;
}
</style>
