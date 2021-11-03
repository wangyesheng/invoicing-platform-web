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
                getLocations();
              }
            "
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleShowLocationDialog(null)">
            新增库位
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <eos-dynamic-table
        :columns="locationTable.columns"
        :data="locationTable.data"
      >
        <el-table-column slot="action" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleShowLocationDialog(row)">
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
      :title="locationDialog.title"
      :visible.sync="locationDialog.visible"
      :close-on-click-modal="false"
    >
      <dynamic-form
        ref="locationFormRef"
        v-model="locationDialog.formData"
        :descriptors="locationDialog.formDescriptors"
      />
      <span slot="footer">
        <el-button @click="locationDialog.visible = false">取 消</el-button>
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
        name: "",
        status: "",
      },
      locationTable: {
        columns: [],
        data: [],
        total: 0,
      },
      locationDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {},
      },
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getLocations()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns },
      } = await this.$get("/api/discovery/view/kw/main");
      this.locationDialog.formDescriptors = descriptors;
      this.locationTable.columns = columns;
    },
    async getLocations() {
      const data = await this.$get(
        "/api/eims/v1/kw/query",
        this.queryCondition
      );
      this.locationTable.data = data;
    },
    handleShowLocationDialog(scope) {
      if (scope == null) {
        this.locationDialog.title = "新增";
        this.locationDialog.formData = {};
      } else {
        this.locationDialog.title = "编辑";
        this.locationDialog.formData = { ...scope };
      }
      this.$refs.locationFormRef && this.$refs.locationFormRef.resetFields();
      this.locationDialog.visible = true;
    },
    onSubmit() {
      this.$refs.locationFormRef.validate(async (valid) => {
        if (valid) {
          const reqData = {
            ...this.locationDialog.formData,
          };
          let data;
          if (reqData.status) {
            const nbr = reqData.nbr;
            delete reqData.nbr;
            data = await this.$put(`/api/eims/v1/kw/_/${nbr}`, reqData);
          } else {
            data = await this.$post(`/api/eims/v1/kw/_`, reqData);
          }
          if (data) {
            this.$message.success("操作成功！");
            this.locationDialog.visible = false;
            this.getLocations();
          }
        }
      });
    },
    async handleConfirmDelete(nbr) {
      const data = await this.$delete(`/api/eims/v1/kw/${nbr}`);
      if (data) {
        this.$message.success("操作成功！");
        this.getLocations();
      }
    },
  },
};
</script>