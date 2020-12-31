<template>
  <div class="app-content">
    <div class="api-wrap">
      <el-collapse
        v-model="activeApis"
        accordion
      >
        <el-collapse-item
          v-for="propItem in properties"
          :key="propItem.module"
          :name="propItem.module"
          :title="propItem.name"
        >
          <h3>Apis</h3>
          <div>
            
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { getApisRes } from '@/api/api';
export default {
  data() {
    return {
      desc: '',
      properties: [],
      activeApis: [],
    };
  },
  mounted() {
    this.getApis();
  },
  methods: {
    async getApis() {
      const { desc, properties } = await getApisRes();
      this.desc = desc;
      this.properties = properties;
      this.activeApis = [properties[0].module];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>