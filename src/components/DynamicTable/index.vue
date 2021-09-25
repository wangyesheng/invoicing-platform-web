<template>
  <el-table v-bind="$attrs" v-on="$listeners" :data="data">
    <el-table-column
      v-for="(item, idx) in columns"
      v-bind="columnAttrs"
      :key="idx"
      :prop="item.prop"
      :label="item.label"
    >
      <template slot-scope="{ row }">
        <slot :name="item.prop" :[item.prop]="row[item.prop]">
          <template v-if="item.renderMode">
            <img v-if="item.renderMode == 'img'" :src="row[item.prop]" alt="" />
            <el-tag
              v-else-if="item.renderMode == 'tag'"
              :type="renderTag(item.source, row[item.prop]).type"
            >
              {{ renderTag(item.source, row[item.prop]).label }}
            </el-tag>
            <el-link v-else-if="item.renderMode == 'link'" type="primary">
              {{ row[item.prop] }}
            </el-link>
            <span v-else-if="item.type == 'array'">
              {{ row[item.prop].join(" / ") }}
            </span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
          <template v-else>
            <span>{{ row[item.prop] }}</span>
          </template>
        </slot>
      </template>
    </el-table-column>
    <slot name="action" />
    <slot name="extraAction" />
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    columnAttrs: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    renderTag(source, value) {
      return source[value];
    },
  },
};
</script>
