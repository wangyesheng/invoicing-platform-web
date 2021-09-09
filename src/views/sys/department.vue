<style lang="scss" scoped>
</style>
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
          <el-button
            type="primary"
            @click="
              () => {
                getDepts();
              }
            "
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleShowDeptDialog(null)">
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <eos-dynamic-table
        :columns="deptTable.columns"
        :data="deptTable.data"
      >
        <el-table-column slot="action" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleShowDeptDialog(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleConfirmDelete(row.nbr)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </eos-dynamic-table>
    </el-card>
    <el-dialog
      width="30%"
      :title="deptDialog.title"
      :visible.sync="deptDialog.visible"
      :close-on-click-modal="false"
    >
      <dynamic-form
        ref="deptFormRef"
        v-model="deptDialog.formData"
        :descriptors="deptDialog.formDescriptors"
      />
      <span slot="footer">
        <el-button @click="deptDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryCondition: {
        nbr: "",
        status: "",
      },
      deptTable: {
        columns: [],
        data: [],
        total: 0,
      },
      deptDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {},
      },
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getDepts()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns },
      } = await this.$get("/api/discovery/view/ks/main");
      this.deptDialog.formDescriptors = descriptors;
      this.deptTable.columns = columns;
    },
    async getDepts() {
      const data = await this.$get(
        "/api/plat/v2/ks/query",
        this.queryCondition
      );
      this.deptTable.data = data;
    },
    handleShowDeptDialog(scope) {
      if (scope == null) {
        this.deptDialog.title = "新增";
        this.deptDialog.formData = {};
      } else {
        this.deptDialog.title = "编辑";
        this.deptDialog.formData = { ...scope };
      }
      this.$refs.deptFormRef && this.$refs.deptFormRef.resetFields();
      this.deptDialog.visible = true;
    },
    onSubmit() {
      this.$refs.deptFormRef.validate(async (valid) => {
        if (valid) {
          const reqData = {
            ...this.deptDialog.formData,
          };
          let data;
          if (reqData.status) {
            const nbr = reqData.nbr;
            delete reqData.nbr;
            data = await this.$put(`/api/plat/v2/ks/_/${nbr}`, reqData);
          } else {
            data = await this.$post(`/api/plat/v2/ks/_`, reqData);
          }
          if (data) {
            this.$message.success("操作成功！");
            this.deptDialog.visible = false;
            this.getDepts();
          }
        }
      });
    },
    async handleConfirmDelete(nbr) {
      const data = await this.$delete(`/api/plat/v2/ks/${nbr}`);
      if (data) {
        this.$message.success("操作成功！");
        this.getDepts();
      }
    },
  },
};
</script>