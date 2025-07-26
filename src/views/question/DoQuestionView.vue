<template>
  <div id="doQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目描述">
            <a-card :title="question?.title">
              <MdViewer :value="question?.content" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="answer" title="题解"> 题解</a-tab-pane>
          <!--          <a-tab-pane key="comment" title="评论"> 评论</a-tab-pane>-->
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form-item field="language" label="编程语言">
          <a-select
            v-model="form.language"
            :style="{ width: '200px' }"
            placeholder="请选择编程语言"
          >
            <a-option>java</a-option>
            <a-option>cpp</a-option>
            <a-option>go</a-option>
            <a-option>python</a-option>
            <a-option>html</a-option>
          </a-select>
        </a-form-item>

        <CodeEditor
          :value="form.code"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-button
          type="primary"
          size="large"
          style="margin-top: 20px"
          @click="doSubmit"
          >提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import {
  QuestionControllerService,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import message from "@arco-design/web-vue/es/message";

const route = useRoute();
const question = ref<QuestionVO>();

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const loadData = async () => {
  //获取题目id
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

//代码的参数
const form = ref({
  language: "java",
  code: "",
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败," + res.message);
  }
};

onMounted(() => {
  loadData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style scoped>
#doQuestionView {
}
</style>
