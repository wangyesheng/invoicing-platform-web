<style lang="scss" scoped></style>
<template>
  <div class="content-wrap">
    <Query
      :config="{
        fields: {
          roleId: { control: 'input', label: '角色编号', value: '' },
          name: { control: 'input', label: '角色名称', value: '' },
          isActive: { control: 'select', label: '状态', value: '' },
        },
      }"
      @on-search="handleSearch"
    >
      <el-form-item slot="queryAction">
        <el-button type="primary" @click="handleShowRoleDialog(null)">
          新增父级角色
        </el-button>
      </el-form-item>
    </Query>

    <el-card shadow="never">
      <!-- <eos-dynamic-table :columns="roleTable.columns" :data="roleTable.data">
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
      </eos-dynamic-table> -->
      <el-table
        row-key="roleId"
        default-expand-all
        :data="roleTable.data"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="roleId" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="isActive" label="状态">
          <template slot-scope="{ row }">
            <el-tag :type="row.isActive == 1 ? 'primary' : 'info'">
              {{ row.isActive == 1 ? "有效" : "无效" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
      </el-table>
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
import Query from "@/components/CRUD/query";

export default {
  mixins: [formDescriptorsMixin],

  components: {
    Query,
  },

  data() {
    return {
      queryCondition: {
        name: "",
        roleId: "",
        isActive: "",
      },
      roleTable: {
        columns: [],
        data: [],
        total: 0,
      },
      roleDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {},
      },
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
        table: { columns },
      } = await this.$get("/api/discovery/view/role/main");
      this.roleDialog.formDescriptors = this.renderFormDescriptors(descriptors);
      this.roleTable.columns = columns;
    },
    async getRoles() {
      const data = await this.$get(
        "/api/core/v1/role/query",
        this.queryCondition
      );
      this.roleTable.data = this.renderRoleTree(data);
    },
    renderRoleTree(data) {
      const root = data.filter((x) => !x.parentId);
      for (let i = 0; i < root.length; i++) {
        const parent = root[i];
        next(parent, data);
      }
      function next(parent, children) {
        parent.children = [];
        for (let j = 0; j < children.length; j++) {
          const child = children[j];
          if (child.parentId == parent.roleId) {
            parent.children.push(child);
            next(child, children);
          }
        }
      }
      return root;
    },
    handleShowRoleDialog(scope) {
      if (scope == null) {
        this.roleDialog.title = "新增";
      } else if (typeof scope == "string") {
        this.roleDialog.title = "新增";
        this.roleDialog.formData = {
          parentId: scope,
        };
      } else {
        this.roleDialog.title = "编辑";
        this.roleDialog.formData = { ...scope };
      }
      this.$refs.roleFormRef && this.$refs.roleFormRef.resetFields();
      this.roleDialog.visible = true;
    },
    onSubmit() {
      this.$refs.roleFormRef.validate(async (valid) => {
        if (valid) {
          const reqData = {
            ...this.roleDialog.formData,
          };
          let data;
          if (this.roleDialog.title == "新增") {
            data = await this.$post(`/api/core/v1/role`, reqData);
          } else {
            delete reqData.roleId;
            delete reqData.pName;
            delete reqData.children
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
    },
  },
};
</script>
