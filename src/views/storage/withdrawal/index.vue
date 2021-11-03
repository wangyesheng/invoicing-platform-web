<style lang="scss" scoped></style>
<template>
  <div class="content-wrap">
    <CRUD
      :query-config="{
        fields: {
          nbr: { control: 'input', label: '编号', value: '' },
          part: { control: 'input', label: '部件编号', value: '' },
          timerange: {
            control: 'date',
            label: '时间区间',
            value: '',
            mapFields: { [0]: 'startTime', [1]: 'endTime' }
          }
        }
      }"
      :table-config="{
        columnAttrs: { align: 'center' },
        tableAttrs: { border: true }
      }"
      :urls="{
        view: '/api/discovery/view/returnStock/main',
        get: '/api/eims/v1/returnStock/query',
        post: '/api/eims/v1/returnStock',
        put: '/api/eims/v1/returnStock',
        delete: '/api/eims/v1/returnStock'
      }"
    >
      <!-- <span slot="queryAction">
        <el-button type="primary" @click="handleShowStorageDialog(row)">
          新增
        </el-button>
      </span> -->
      <!-- <el-table-column slot="containerAction" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleShowStorageDialog(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗11？"
            @confirm="handleConfirmDelete(row)"
          >
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column> -->
      <!-- <span slot="effectAction">
        <el-button @click="storageDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span> -->
    </CRUD>
  </div>
</template>

<script>
import CRUD from "@/components/CRUD/index.vue";

export default {
  components: {
    CRUD
  }
};
</script>
