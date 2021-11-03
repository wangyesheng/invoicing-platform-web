<style lang="scss" scoped></style>
<template>
  <div class="content-wrap">
    <CRUD
      :query-config="{
        nbr: { control: 'input', label: '编号', value: '' },
        part: { control: 'input', label: '物品编号', value: '' },
        timerange: { control: 'date', label: '时间区间', value: [] },
      }"
      :table-config="{
        columns: storageTable.columns,
        data: storageTable.data,
        columnAttrs: { align: 'center' },
        tableAttrs: { border: true },
      }"
      :effect-config="{
        title: '编辑',
        ref: 'storage',
        formData: storageDialog.formData,
        formDescriptors: storageDialog.formDescriptors,
      }"
      @on-search="handleSearch"
    >
      <!-- <el-button slot="extraAction" slot-scope="{ row }">Click</el-button> -->
      <!-- <el-table-column slot="action" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleShowStorageDialog(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleConfirmDelete(row.orgid)"
          >
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column> -->
      <span slot="footer">
        <el-button @click="storageDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </CRUD>
    <!-- <el-dialog
      width="30%"
      :title="storageDialog.title"
      :visible.sync="storageDialog.visible"
      :close-on-click-modal="false"
    >
      <dynamic-form
        ref="storageFormRef"
        v-model="storageDialog.formData"
        :descriptors="storageDialog.formDescriptors"
      />
      <span slot="footer">
        <el-button @click="storageDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import CRUD from "@/components/CRUD/index.vue";
import formDescriptorsMixin from "@/mixins/formDescriptorsMixin";

export default {
  mixins: [formDescriptorsMixin],

  components: {
    CRUD,
  },

  data() {
    return {
      queryCondition: {
        nbr: "",
        part: "",
        startTime: "",
        endTime: "",
      },
      storageTable: {
        columns: [],
        data: [],
        total: 0,
      },
      storageDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {},
      },
    };
  },

  computed: {
    ...mapGetters(["userinfo"]),
  },

  mounted() {
    Promise.all([this.getMianView(), this.getStorages()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns },
      } = await this.$get("/api/discovery/view/returnStock/main");
      this.storageDialog.formDescriptors =
        this.renderFormDescriptors(descriptors);
      this.storageTable.columns = columns;
    },
    handleSearch(value) {
      console.log(value);
    },
    // handleTableRowClick(...args) {
    //   console.log(args);
    // },
    async getStorages() {
      const data = await this.$get(
        "/api/eims/v1/returnStock/query",
        this.queryCondition
      );
      this.storageTable.data = data;
    },
    handleShowStorageDialog(scope) {
      if (scope == null) {
        this.storageDialog.title = "新增";
        this.storageDialog.formData = {
          operator: this.userinfo.account,
          _operator: this.userinfo.userId,
        };
      } else {
        this.storageDialog.title = "编辑";
        this.storageDialog.formData = { ...scope };
      }
      this.$refs.storageFormRef && this.$refs.storageFormRef.resetFields();
      this.storageDialog.visible = true;
    },
    onSubmit() {
      this.$refs.storageFormRef.validate(async (valid) => {
        if (valid) {
          const reqData = {
            ...this.storageDialog.formData,
            operator: this.storageDialog.formData._operator,
          };
          Object.keys(reqData).forEach((key) => {
            if (key.startsWith("_")) delete reqData[key];
          });
          console.log(reqData);
          const data = await this.$post(`/api/eims/v1/returnStock`, reqData);
          if (data) {
            this.$message.success("操作成功！");
            this.storageDialog.visible = false;
            this.getStorages();
          }
        }
      });
    },
    handleEdit(scope) {
      console.log(scope);
    },
    async handleConfirmDelete(orgid) {
      console.log(orgid);
      // const data = await this.$delete(`/api/plat/v2/org/${orgid}`);
      // if (data) {
      //   this.$message.success("操作成功！");
      // }
    },
  },
};
</script>
