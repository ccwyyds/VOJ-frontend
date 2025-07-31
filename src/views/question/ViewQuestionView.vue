<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <!-- 左侧主体 -->
      <a-col :md="18" :xs="24">
        <a-card>
          <a-tabs default-active-key="question" @change="onTabChange">
            <a-tab-pane key="question" title="题目描述">
              <a-card
                :title="question?.title"
                style="font-size: 15px"
                :bordered="false"
              >
                <MdViewer :value="question?.content || ''" />
              </a-card>
            </a-tab-pane>
            <a-tab-pane key="doQuestion" title="点击做题"></a-tab-pane>
            <a-tab-pane key="answer" title="题解"> 题解</a-tab-pane>
            <a-tab-pane key="comment" title="评论"> 评论</a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>

      <!-- 右侧信息栏 -->
      <a-col :md="6" :xs="24">
        <a-card class="info-card">
          <div style="display: flex; flex-direction: column">
            <div>题目编号：{{ question?.questionNum }}</div>
            <div style="margin-top: 20px">
              提供者：{{ question?.userVO?.userName || "未知" }}
            </div>
            <div style="margin-top: 20px">
              提交数：{{ question?.submitNum }}
            </div>
            <div style="margin-top: 20px">
              通过数：{{ question?.acceptedNum }}
            </div>
            <div style="margin-top: 20px">
              时间限制：{{ question?.judgeConfig?.timeLimit || 0 }} S
            </div>
            <div style="margin-top: 20px">
              内存限制：{{ question?.judgeConfig?.memoryLimit || 0 }} MB
            </div>
            <div style="margin-top: 20px">
              堆栈限制：{{ question?.judgeConfig?.stackLimit || 0 }} MB
            </div>
          </div>
        </a-card>
        <a-card class="info-card" style="margin-top: 16px">
          <div style="margin-bottom: 20px">标签</div>
          <a-space wrap>
            <a-tag size="large" v-for="tags in question?.tags" color="green"
              >{{ tags }}
            </a-tag>
          </a-space>
        </a-card>
        <a-card class="info-card" style="margin-top: 16px">
          <div>热门评论</div>
        </a-card>
        <a-card class="info-card" style="margin-top: 16px">
          <div>推荐题目</div>
          <!-- 推荐题目列表 -->
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import MdViewer from "@/components/MdViewer.vue";
import { useRouter } from "vue-router";
import { QuestionControllerService, QuestionVO } from "../../../generated";
import { useStore } from "vuex";
import ACCESS_ENUM from "@/permissions/AccessEnum";

const router = useRouter();
const store = useStore();

const route = useRoute();
const question = ref<QuestionVO>();

// 获取用户信息
const userInfo = computed(() => store.state.user.loginUser);

const loadData = async () => {
  //获取题目id
  const questionId: any = route.query.id;

  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    questionId
  );
  if (res.code === 0) {
    question.value = res.data;
  }
};

onMounted(() => {
  loadData();
});

const onTabChange = (key: string) => {
  if (key === "doQuestion") {
    // 检查用户是否已登录
    if (
      !userInfo.value ||
      !userInfo.value.userRole ||
      userInfo.value.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      // 未登录，跳转到登录页面
      router.push({
        path: "/user/login",
        query: {
          redirect: `/do/question/${question.value?.id}`,
        },
      });
    } else {
      // 已登录，直接跳转到做题页面
      router.push({
        path: `/do/question/${question.value?.id}`,
      });
    }
  }
};
</script>

<style scoped>
#viewQuestionView {
  max-width: 1280px;
  margin: 0 auto;
}

/* 深度作用选择器，针对 ant-design-vue 的 a-card-title */
::v-deep(.arco-card-header-title) {
  font-size: 25px;
  font-weight: bold;
}

.info-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

a-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
