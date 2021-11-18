<style lang="scss" scoped></style>
<template>
  <div class="content-wrap">
    <Query
      :config="{
        fields: {
          id: { control: 'input', label: '角色编号', value: '' },
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
            <el-button type="text" @click="handleShowRoleDialog(row.id)">
              新增子级角色
            </el-button>
            <el-button type="text" @click="handleShowRoleDialog(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleConfirmDelete(row.id)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </eos-dynamic-table> -->
      <el-table
        row-key="id"
        default-expand-all
        :data="roleTable.data"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="编号" />
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
            <el-button type="text" @click="handleShowAssignDialog(row)">
              分配权限
            </el-button>
            <el-button type="text" @click="handleShowRoleDialog(row.id)">
              新增子级角色
            </el-button>
            <el-button type="text" @click="handleShowRoleDialog(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleConfirmDelete(row.id)"
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
    <el-dialog
      width="30%"
      :title="assignDialog.title"
      :visible.sync="assignDialog.visible"
      :close-on-click-modal="false"
    >
      <div class="assign-wrap" v-loading="assignDialog.loading">
        <el-tree
          show-checkbox
          default-expand-all
          node-key="id"
          ref="assignTreeRef"
          :data="assignDialog.data"
          :props="{
            children: 'children',
            label: 'desc',
          }"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleAssignSubmit">确 定</el-button>
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
        id: "",
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
      assignDialog: {
        title: "",
        visible: false,
        data: [],
        currentRole: {},
        loading: false,
      },
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getRoles(), this.getPermissions()]);
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
      this.roleTable.data = this.renderTree(data);
    },
    async getPermissions() {
      const data = await this.$get("/api/core/v1/fun/query");
      this.assignDialog.data = this.renderTree(data);
    },
    renderTree(data) {
      const root = data.filter((x) => !x.parentId);
      for (let i = 0; i < root.length; i++) {
        const parent = root[i];
        next(parent, data);
      }
      function next(parent, children) {
        parent.children = [];
        for (let j = 0; j < children.length; j++) {
          const child = children[j];
          if (child.parentId == parent.id) {
            parent.children.push(child);
            next(child, children);
          }
        }
      }
      return root;
    },
    async handleShowAssignDialog(scope) {
      this.assignDialog.loading = true;
      this.assignDialog.visible = true;
      this.assignDialog.title = `分配权限`;
      this.assignDialog.currentRole = scope;
      const data = await this.$get(
        `/api/core/v1/roleFun/query?roleId=${scope.id}`
      );
      this.$refs.assignTreeRef &&
        this.$refs.assignTreeRef.setCheckedKeys(
          data ? data.map((x) => x.funId) : []
        );
      this.assignDialog.loading = false;
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
    handleAssignSubmit() {
      this.$confirm("确认为该角色分配所选定的权限吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const funIds = this.$refs.assignTreeRef.getCheckedKeys();
          const { id: roleId } = this.assignDialog.currentRole;
          if (funIds.length > 0) {
            const data = await this.$post("/api/core/v1/roleFun/_", {
              roleId,
              roleFun: funIds.map((funId) => ({
                roleId,
                funId,
              })),
            });
            if (data) {
              this.$message.success("设置成功！");
              this.assignDialog.visible = false;
              this.getRoles();
            }
          }
        })
        .catch(() => {});
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
            delete reqData.id;
            delete reqData.pName;
            delete reqData.children;
            data = await this.$put(
              `/api/core/v1/role/${this.roleDialog.formData.id}`,
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
