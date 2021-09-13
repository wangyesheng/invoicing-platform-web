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
                getOrgs();
              }
            "
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleShowOrgDialog(null)">
            新增根组织
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <eos-dynamic-table :columns="orgTable.columns" :data="orgTable.data">
        <el-table-column slot="action" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleShowOrgDialog(row.orgid)">
              新增子组织
            </el-button>
            <el-button type="text" @click="handleShowOrgDialog(row)">
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
      :title="orgDialog.title"
      :visible.sync="orgDialog.visible"
      :close-on-click-modal="false"
    >
      <dynamic-form
        ref="deptFormRef"
        v-model="orgDialog.formData"
        :descriptors="orgDialog.formDescriptors"
      />
      <span slot="footer">
        <el-button @click="orgDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import formDescriptorsMixin from "@/mixins/formDescriptorsMixin";

export default {
  mixins: [formDescriptorsMixin],

  data() {
    return {
      queryCondition: {
        id: null,
        isactive: null,
        name: null,
      },
      orgTable: {
        columns: [],
        data: [],
        total: 0,
      },
      orgDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {},
      },
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getOrgs()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns },
      } = await this.$get("/api/discovery/view/org/main");
      this.orgDialog.formDescriptors = this.renderFormDescriptors(descriptors);
      this.orgTable.columns = columns;
    },
    async getOrgs() {
      const data = await this.$get("/api/plat/v2/org/query");
      this.orgTable.data = data;
    },
    handleShowOrgDialog(scope) {
      if (scope == null) {
        this.orgDialog.title = "新增";
        this.orgDialog.formData = {};
      } else if (typeof scope == "string") {
        this.orgDialog.title = "新增";
        this.orgDialog.formData = {
          parentid: scope,
        };
      } else {
        this.orgDialog.title = "编辑";
        this.orgDialog.formData = { ...scope };
      }
      this.$refs.deptFormRef && this.$refs.deptFormRef.resetFields();
      this.orgDialog.visible = true;
    },
    onSubmit() {
      this.$refs.deptFormRef.validate(async (valid) => {
        if (valid) {
          const reqData = {
            ...this.orgDialog.formData,
          };
          let data;
          if (this.orgDialog.title == "编辑") {
            const orgid = reqData.orgid;
            delete reqData.orgid;
            delete reqData.pname;
            data = await this.$put(`/api/plat/v2/org/_/${orgid}`, reqData);
          } else {
            data = await this.$post(`/api/plat/v2/org/_`, reqData);
          }
          if (data) {
            this.$message.success("操作成功！");
            this.orgDialog.visible = false;
            this.getOrgs();
          }
        }
      });
    },
    async handleConfirmDelete(orgid) {
      const data = await this.$delete(`/api/plat/v2/org/${orgid}`);
      if (data) {
        this.$message.success("操作成功！");
        this.getOrgs();
      }
    },
  },
};
</script>