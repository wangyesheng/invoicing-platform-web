<template>
  <div ref="crudRef" class="crud-wrap">
    <query :config="queryConfig" @on-search="onSearch">
      <template slot="queryAction">
        <slot name="queryAction" />
      </template>
    </query>
    <container
      :columns="config.container.columns"
      :data="config.container.data"
      :columnAttrs="tableConfig.columnAttrs"
      v-bind="tableConfig.tableAttrs"
      v-on="$listeners"
    >
      <template v-if="$slots.containerAction" slot="containerAction">
        <slot name="containerAction" />
      </template>
      <template v-else>
        <el-table-column slot="containerAction" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="onEffect('put', row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="onEffect('delete', row)"
            >
              <el-button slot="reference" type="text">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </container>
    <effect ref="effectRef" :config="config.effect">
      <template slot="effectAction">
        <slot name="effectAction" />
      </template>
    </effect>
  </div>
</template>

<script>
import Container from "./container/Table";
import Effect from "./effect/Dialog";
import Query from "./Query";

import formDescriptorsMixin from "@/mixins/formDescriptorsMixin";

export default {
  mixins: [formDescriptorsMixin],

  components: {
    Container,
    Effect,
    Query
  },

  props: {
    queryConfig: {
      type: Object,
      default: () => {}
    },
    tableConfig: {
      type: Object,
      default: () => {}
    },
    urls: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      config: {
        container: { columns: [], data: [] },
        effect: { formDescriptors: {} }
      }
    };
  },

  mounted() {
    this.getView();
    this.query();
  },

  methods: {
    async getView() {
      const {
        form: { descriptors },
        table: { columns }
      } = await this.$get(this.urls.view);
      this.config.effect.formDescriptors = this.renderFormDescriptors(
        descriptors
      );
      this.config.container.columns = columns;
    },
    async query(payload) {
      const condition = this.mapQueryCondition(payload);
      const data = await this.$get(this.urls.get, condition);
      this.config.container.data = data;
    },
    mapQueryCondition(payload) {
      let condition = {};
      if (payload) {
        condition = payload;
      } else {
        const target = this.queryConfig.fields;
        for (const key in target) {
          const layer = target[key];
          if (key == "timerange") {
            condition[layer.mapFields[0]] = "";
            condition[layer.mapFields[1]] = "";
          } else {
            condition[key] = "";
          }
        }
      }
      return condition;
    },
    onSearch(payload) {
      this.query(payload);
    },
    onEffect(type, scope) {
      this.beforeDoEffect(type, scope);
    },
    beforeDoEffect(type, scope) {
      const effectName = `on-${type}-effect`;
      if (this.$listeners[effectName]) {
        // 用户自己处理副作用
        this.$emit(effectName, scope);
      } else {
        // 采用内部默认的处理方式
        this.doEffect(type, scope);
      }
    },
    doEffect(type, scope) {
      switch (type) {
        case "post":
          this.$refs.effectRef.setVisible(type, this.urls[type], scope);
          break;
        case "put":
          this.$refs.effectRef.setVisible(type, this.urls[type], scope);
          break;
        case "delete":
          this.remove(this.urls[type], scope);
          break;
      }
    },
    async remove(url, scope) {
      const data = await this.$delete(`${url}/${scope.nbr}`);
      console.log(data);
    }
  }
};
</script>
