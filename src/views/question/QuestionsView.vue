<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="题目名称">
        <a-input
          v-model="searchParams.title"
          placeholder="请输入标题"
          style="min-width: 240px"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item>
        <a-button @click="doSubmit" type="primary">提交</a-button>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
        showTotal: true,
      }"
      @page-change="onPageChange"
      @row-click="rowClick"
    >
      <!-- 自定义状态列插槽 -->
      <template #status="{ record }">
        <span v-if="record.isAccepted">
          <icon-check size="20px" style="color: #08e908" />
        </span>
        <span v-else>
          <icon-minus />
        </span>
      </template>

      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) in record.tags" :key="index" color="green">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #acceptedRate="{ record }">
        <a-progress
          type="line"
          :percent="getAcceptedPercent(record.acceptedNum, record.submitNum)"
          status="normal"
          size="medium"
          trackColor="var(--color-primary-light-1)"
        />
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { IconCheck, IconMinus } from "@arco-design/web-vue/es/icon";
import moment from "moment";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    console.log(res.data);
    dataList.value = res.data.records;
    total.value = res.data.total;
    dataList.value = res.data.records.map((item: any) => ({
      ...item,
      // todo 根据题目是否完成进行判断
      isAccepted: 1, // 目前全部通过
    }));
  } else {
    message.error("查询失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "",
    dataIndex: "status", // 自定义字段（可选）
    slotName: "status", // 使用插槽渲染
    width: 40,
  },
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
];

const router = useRouter();

const onPageChange = async (page: number) => {
  searchParams.value.current = page;
  await loadData();
};

const getAcceptedPercent = (acceptedNum: number, submitNum: number): any => {
  if (!submitNum) return 0;
  console.log(acceptedNum / submitNum);
  return (acceptedNum / submitNum).toFixed(3);
};

//点击跳转到做题页面
const rowClick = (record: any) => {
  router.push({
    path: "/view/question",
    query: {
      id: record.id,
    },
  });
};

const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  loadData();
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
