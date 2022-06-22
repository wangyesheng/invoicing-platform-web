<style lang="scss" scoped>
.assign-wrap {
  .el-tag {
    margin-bottom: 10px;
  }
}
</style>
<template>
  <div class="content-wrap">
    <div class="action-wrap">
      <el-form inline>
        <el-form-item label="用户名">
          <el-input
            v-model="queryCondition.userName"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="账号">
          <el-input
            v-model="queryCondition.account"
            placeholder="请输入账号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              () => {
                getUsers();
              }
            "
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleShowUserDialog(null)">
            新增用户
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <eos-dynamic-table :columns="userTable.columns" :data="userTable.data">
        <el-table-column slot="action" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleShowAssignDialog(row, 'role')">
              分配角色
            </el-button>
            <el-button type="text" @click="handleShowAssignDialog(row, 'org')">
              分配组织
            </el-button>
            <el-button type="text" @click="handleShowUserDialog(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleConfirmDelete(row.userId)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </eos-dynamic-table>
    </el-card>
    <el-dialog
      width="30%"
      :title="userDialog.title"
      :visible.sync="userDialog.visible"
      :close-on-click-modal="false"
    >
      <dynamic-form
        ref="userFormRef"
        v-model="userDialog.formData"
        :descriptors="userDialog.formDescriptors"
      />
      <span slot="footer">
        <el-button @click="userDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      width="30%"
      :title="assignDialog.title"
      :visible.sync="assignDialog.visible"
      :close-on-click-modal="false"
    >
      <div class="assign-wrap">
        <el-tree
          show-checkbox
          default-expand-all
          node-key="id"
          ref="assignTreeRef"
          :data="assignDialog.data"
          :props="{
            children: 'children',
            label: 'name'
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

export default {
  mixins: [formDescriptorsMixin],

  data() {
    return {
      queryCondition: {
        userName: "",
        account: "",
        domain: ""
      },
      userTable: {
        columns: [],
        data: [],
        total: 0
      },
      userDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {}
      },
      assignDialog: {
        title: "",
        visible: false,
        data: [],
        currentUser: {},
        flag: null // 当前操作的是角色还是组织,
      }
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getUsers()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns }
      } = await this.$get("api/discovery/view/user/main");
      this.userDialog.formDescriptors = this.renderFormDescriptors(descriptors);
      this.userTable.columns = columns.filter(x => x.isShow !== false);
    },
    async getOrgs() {
      const data = await this.$get("/api/core/v1/org/query");
      this.assignDialog.data = this.orgTree = this.renderTree(data);
    },
    async getRoles() {
      const data = await this.$get("/api/core/v1/role/query");
      this.assignDialog.data = this.roleTree = this.renderTree(data);
    },
    renderTree(data) {
      const root = data.filter(x => !x.parentId);
      for (let i = 0; i < root.length; i++) {
        next(root[i], data);
      }

      function next(parent, data) {
        parent.children = [];
        for (let i = 0; i < data.length; i++) {
          const layer = data[i];
          if (layer.parentId == parent.id) {
            parent.children.push({
              ...layer,
              key: layer.id
            });
            next(layer, data);
          }
        }
      }
      return root;
    },
    async getUsers() {
      const data = await this.$get(
        "/api/core/v1/user/query",
        this.queryCondition
      );
      this.userTable.data = data.map(x => ({
        ...x,
        isActive: x.isActive + ""
      }));
    },
    handleShowUserDialog(scope) {
      if (scope == null) {
        this.userDialog.title = "新增";
        this.userDialog.formData = {};
      } else {
        this.userDialog.title = "编辑";
        this.userDialog.formData = { ...scope };
      }
      this.$refs.userFormRef && this.$refs.userFormRef.resetFields();
      this.userDialog.visible = true;
    },
    async handleShowAssignDialog(scope, flag) {
      this.assignDialog.loading = true;
      this.assignDialog.visible = true;
      this.assignDialog.flag = flag;
      this.assignDialog.currentUser = scope;
      let checkKeys = [];
      if (flag == "role") {
        const data = await this.$get(
          `/api/core/v1/userRole/query?userId=${scope.userId}`
        );
        checkKeys = data ? data.map(x => x.roleId) : [];
        this.assignDialog.title = "分配角色";
        this.roleTree
          ? (this.assignDialog.data = this.roleTree)
          : this.getRoles();
      } else {
        const data = await this.$get(
          `/api/core/v1/userOrg/query?userId=${scope.userId}`
        );
        checkKeys = data ? data.map(x => x.orgId) : [];
        this.assignDialog.title = "分配组织";
        this.orgTree ? (this.assignDialog.data = this.orgTree) : this.getOrgs();
      }
      this.$refs.assignTreeRef &&
        this.$refs.assignTreeRef.setCheckedKeys(checkKeys);
      this.assignDialog.loading = false;
    },
    handleAssignSubmit() {
      this.$confirm(
        `确认为该用户分配所选定的${
          this.assignDialog.flag == "role" ? "角色" : "组织"
        }吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          const keys = this.$refs.assignTreeRef.getCheckedKeys();
          const { userId } = this.assignDialog.currentUser;
          if (keys.length > 0) {
            const data =
              this.assignDialog.flag == "role"
                ? await this.$post("/api/core/v1/userRole/_", {
                    userId,
                    userRole: keys.map(roleId => ({
                      roleId,
                      userId
                    }))
                  })
                : await this.$post("/api/core/v1/userOrg/_", {
                    userId,
                    userOrg: keys.map(orgId => ({
                      orgId,
                      userId
                    }))
                  });
            if (data) {
              this.$message.success("设置成功！");
              this.assignDialog.visible = false;
              this.getUsers();
            }
          }
        })
        .catch(() => {});
    },
    onSubmit() {
      this.$refs.userFormRef.validate(async valid => {
        if (valid) {
          const reqData = {
            ...this.userDialog.formData
          };
          let data;
          if (this.userDialog.title == "编辑") {
            const userId = reqData.userId;
            delete reqData.userId;
            delete reqData.orgId;
            delete reqData.orgName;
            delete reqData.password;
            delete reqData.account;
            data = await this.$put(`/api/core/v1/user/${userId}`, reqData);
          } else {
            data = await this.$post(`/api/core/v1/user`, reqData);
          }
          if (data) {
            this.$message.success("操作成功！");
            this.userDialog.visible = false;
            this.getUsers();
          }
        }
      });
    },
    async handleConfirmDelete(userId) {
      const data = await this.$delete(`/api/core/v1/user/${userId}`);
      if (data) {
        this.$message.success("操作成功！");
        this.getUsers();
      }
    }
  }
};
</script>
