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
        <el-form-item label="域">
          <el-input
            v-model="queryCondition.domain"
            placeholder="请输入域"
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
            <el-button type="text" @click="handleShowAssignOrgDialog(row)">
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
      :title="assignOrgDialog.title"
      :visible.sync="assignOrgDialog.visible"
      :close-on-click-modal="false"
    >
      <div class="assign-wrap">
        <el-tag>{{ assignOrgDialog.currentUser.userName }}</el-tag>
        <el-tree
          show-checkbox
          default-expand-all
          node-key="orgid"
          ref="orgTreeRef"
          :data="assignOrgDialog.orgs"
          :default-checked-keys="[assignOrgDialog.currentUser.orgId]"
          :props="{
            children: 'children',
            label: 'name',
          }"
          @check="onTreeChecked"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignOrgDialog.visible = false">取 消</el-button>
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
        domain: "",
      },
      userTable: {
        columns: [],
        data: [],
        total: 0,
      },
      userDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {},
      },
      assignOrgDialog: {
        title: "",
        visible: false,
        orgs: [],
        currentUser: {},
        defaultCheckedOrgIds: [],
      },
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getUsers(), this.getOrgs()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns },
      } = await this.$get("api/discovery/view/user/main");
      this.userDialog.formDescriptors = this.renderFormDescriptors(descriptors);
      this.userTable.columns = columns;
    },
    async getOrgs() {
      const data = await this.$get("/api/plat/v2/org/query");
      const orgs = data
        .filter((x) => !x.parentid)
        .map((x) => ({ ...x, children: [] }));
      for (let i = 0; i < data.length; i++) {
        const layer = data[i];
        if (layer.parentid) {
          this.walk(layer, orgs);
        } else {
          continue;
        }
      }
      this.assignOrgDialog.orgs = orgs;
    },
    walk(layer, orgs) {
      for (let i = 0; i < orgs.length; i++) {
        if (layer.parentid == orgs[i].orgid) {
          orgs[i].children.push({
            ...layer,
            children: [],
          });
        } else {
          this.walk(layer, orgs[i].children);
        }
      }
    },
    async getUsers() {
      const data = await this.$get(
        "/api/plat/v2/user/query",
        this.queryCondition
      );
      this.userTable.data = data;
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
    handleShowAssignOrgDialog(scope) {
      this.$refs.orgTreeRef && this.$refs.orgTreeRef.setCheckedNodes([]);
      this.assignOrgDialog.title = "分配组织";
      this.assignOrgDialog.currentUser = scope;
      this.assignOrgDialog.visible = true;
    },
    handleAssignSubmit() {
      this.$confirm("确认为该用户分配该组织吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const data = await this.$post("/api/plat/v2/user/org", {
            userId: this.assignOrgDialog.currentUser.userId,
            orgId: this.checkedOrgId,
          });
          if (data) {
            this.$message.success("设置成功！");
            this.assignOrgDialog.visible = false;
            this.getUsers();
          }
        })
        .catch(() => {});
    },
    onTreeChecked(node) {
      this.checkedOrgId = node.orgid;
    },
    onSubmit() {
      this.$refs.userFormRef.validate(async (valid) => {
        if (valid) {
          const reqData = {
            ...this.userDialog.formData,
          };
          let data;
          if (this.userDialog.title == "编辑") {
            const userId = reqData.userId;
            delete reqData.userId;
            data = await this.$put(`/api/plat/v2/user/_/${userId}`, reqData);
          } else {
            data = await this.$post(`/api/plat/v2/user/_`, reqData);
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
      const data = await this.$delete(`/api/plat/v2/user/_/${userId}`);
      if (data) {
        this.$message.success("操作成功！");
        this.getUsers();
      }
    },
  },
};
</script>