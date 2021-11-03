<style lang="scss" scoped></style>
<template>
  <div class="content-wrap">
    <Query
      :condition="{
        roleId: { control: 'input', label: '角色编号', value: '' },
        name: { control: 'input', label: '角色名称', value: '' },
        isActive: { control: 'input', label: '状态', value: '' }
      }"
      @on-search="handleSearch"
    >
      <el-form-item slot="effect">
        <el-button type="primary" @click="handleShowRoleDialog(null)">
          新增父级角色
        </el-button>
      </el-form-item>
    </Query>

    <el-card shadow="never">
      <eos-dynamic-table :columns="roleTable.columns" :data="roleTable.data">
        <el-table-column slot="action" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleShowRoleDialog(row.roleId)">
              新增子级角色
            </el-button>
            <el-button type="text" @click="handleShowRoleDialog(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleConfirmDelete(row.roleId)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </eos-dynamic-table>
    </el-card>
    <el-dialog
      width="30%"
      :title="roleDialog.title"
      :visible.sync="roleDialog.visible"
      :close-on-click-modal="false"
    >
      <dynamic-form
        ref="roleFormRef"
        v-model="roleDialog.formData"
        :descriptors="roleDialog.formDescriptors"
      />
      <span slot="footer">
        <el-button @click="roleDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import formDescriptorsMixin from "@/mixins/formDescriptorsMixin";
import Query from "@/components/CRUD/Query";

export default {
  mixins: [formDescriptorsMixin],

  components: {
    Query
  },

  data() {
    return {
      queryCondition: {
        name: "",
        roleId: "",
        isActive: ""
      },
      roleTable: {
        columns: [],
        data: [],
        total: 0
      },
      roleDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {}
      }
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getRoles()]);
  },

  methods: {
    handleSearch(params) {
      this.queryCondition = params;
      this.getRoles();
    },
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns }
      } = await this.$get("/api/discovery/view/role/main");
      this.roleDialog.formDescriptors = this.renderFormDescriptors(descriptors);
      this.roleTable.columns = columns;
    },
    async getRoles() {
      const data = await this.$get(
        "/api/core/v1/role/query",
        this.queryCondition
      );
      this.roleTable.data = data;
    },
    handleShowRoleDialog(scope) {
      if (scope == null) {
        this.roleDialog.title = "新增";
      } else if (typeof scope == "string") {
        this.roleDialog.title = "新增";
        this.roleDialog.formData = {
          parentId: scope
        };
      } else {
        this.roleDialog.title = "编辑";
        this.roleDialog.formData = { ...scope };
      }
      this.$refs.roleFormRef && this.$refs.roleFormRef.resetFields();
      this.roleDialog.visible = true;
    },
    onSubmit() {
      this.$refs.roleFormRef.validate(async valid => {
        if (valid) {
          const reqData = {
            ...this.roleDialog.formData
          };
          let data;
          if (this.roleDialog.title == "新增") {
            data = await this.$post(`/api/core/v1/role`, reqData);
          } else {
            delete reqData.roleId;
            delete reqData.pName;
            data = await this.$put(
              `/api/core/v1/role/${this.roleDialog.formData.roleId}`,
              reqData
            );
          }
          if (data) {
            this.$message.success("操作成功！");
            this.roleDialog.visible = false;
            this.getRoles();
          }
        }
      });
    },
    async handleConfirmDelete(id) {
      const data = await this.$delete(`/api/core/v1/role/${id}`);
      if (data) {
        this.$message.success("操作成功！");
        this.getRoles();
      }
    }
  }
};
</script>
