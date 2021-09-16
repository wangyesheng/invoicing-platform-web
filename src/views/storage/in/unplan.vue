<style lang="scss" scoped></style>
<template>
  <div class="content-wrap">
    <div class="action-wrap">
      <el-form inline>
        <el-form-item label="编号">
          <el-input
            v-model="queryCondition.nbr"
            placeholder="请输入编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input
            v-model="queryCondition.name"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryCondition.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"> 查询 </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleShowStorageDialog(null)">
            新增计划外入库单
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <eos-dynamic-table
        :columns="storageTable.columns"
        :data="storageTable.data"
      >
        <el-table-column slot="action" label="操作">
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
        </el-table-column>
      </eos-dynamic-table>
    </el-card>
    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
import formDescriptorsMixin from "@/mixins/formDescriptorsMixin";
import { mapGetters } from "vuex";

export default {
  mixins: [formDescriptorsMixin],

  data() {
    return {
      queryCondition: {
        nbr: "",
        part: "",
        startTime: "",
        endTime: ""
      },
      storageTable: {
        columns: [],
        data: [],
        total: 0
      },
      storageDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {}
      }
    };
  },

  computed: {
    ...mapGetters(["userinfo"])
  },

  mounted() {
    Promise.all([this.getMianView(), this.getStorages()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns }
      } = await this.$get("/api/discovery/view/unplan/main");
      this.storageDialog.formDescriptors = this.renderFormDescriptors(
        descriptors
      );
      this.storageTable.columns = columns;
    },
    async getStorages() {
      const data = await this.$get(
        "/api/plat/v2/receipt/unplan",
        this.queryCondition
      );
      this.storageTable.data = data;
    },
    handleShowStorageDialog(scope) {
      if (scope == null) {
        this.storageDialog.title = "新增";
        this.storageDialog.formData = {
          operator: this.userinfo.account,
          _operator: this.userinfo.userId
        };
      } else {
        this.storageDialog.title = "编辑";
        this.storageDialog.formData = { ...scope };
      }
      this.$refs.storageFormRef && this.$refs.storageFormRef.resetFields();
      this.storageDialog.visible = true;
    },
    onSubmit() {
      this.$refs.storageFormRef.validate(async valid => {
        if (valid) {
          const reqData = {
            ...this.storageDialog.formData,
            operator: this.storageDialog.formData._operator
          };
          Object.keys(reqData).forEach(key => {
            if (key.startsWith("_")) delete reqData[key];
          });
          const data = await this.$post(`/api/plat/v2/receipt/unplan`, reqData);
          if (data) {
            this.$message.success("操作成功！");
            this.storageDialog.visible = false;
            this.getStorages();
          }
        }
      });
    },
    async handleConfirmDelete(orgid) {
      const data = await this.$delete(`/api/plat/v2/org/${orgid}`);
      if (data) {
        this.$message.success("操作成功！");
      }
    }
  }
};
</script>
