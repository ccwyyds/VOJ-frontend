<template>
  <div id="body">
    <div id="basicLayout">
      <a-layout>
        <a-layout-header class="header">
          <global-header />
        </a-layout-header>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>

      <GlobalFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
import GlobalFooter from "@/components/GlobalFooter.vue";
</script>

<style scoped>
#body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#basicLayout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 内容区样式 */
#basicLayout .header {
  margin-bottom: 20px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  background-color: #ffffff;
  flex: 1;
  padding: 20px; /* 给点空间更美观 */
}
</style>
