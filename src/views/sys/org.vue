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
            新增组织
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <!-- <eos-dynamic-table :columns="orgTable.columns" :data="orgTable.data">
        <el-table-column slot="action" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleShowOrgDialog(row.id)">
              新增子组织
            </el-button>
            <el-button type="text" @click="handleShowOrgDialog(row)">
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
        :data="orgTable.data"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="isactive" label="状态">
          <template slot-scope="{ row }">
            <el-tag :type="row.isactive == 1 ? 'primary' : 'danger'">
              {{ row.isactive == 1 ? "有效" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <!-- <el-button type="text" @click="handleShowOrgDialog(row.id)">
              新增子组织
            </el-button> -->
            <el-button type="text" @click="handleShowOrgDialog(row)">
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
        name: null
      },
      orgTable: {
        columns: [],
        data: [],
        total: 0
      },
      orgDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {}
      }
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getOrgs()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns }
      } = await this.$get("/api/discovery/view/org/main");
      this.orgDialog.formDescriptors = this.renderFormDescriptors(descriptors);
      this.orgTable.columns = columns;
    },
    async getOrgs() {
      const data = await this.$get("/api/core/v1/org/query");
      const root = this.renderOrgTree(data);
      this.orgTable.data = root;
    },
    renderOrgTree(data) {
      const root = data.filter(x => !x.parentId);
      for (let i = 0; i < root.length; i++) {
        next(root[i], data);
      }

      function next(parent, data) {
        parent.children = [];
        for (let i = 0; i < data.length; i++) {
          const layer = data[i];
          if (layer.parentId == parent.id) {
            parent.children.push(layer);
            next(layer, data);
          }
        }
      }

      return root;
    },
    handleShowOrgDialog(scope) {
      if (scope == null) {
        this.orgDialog.title = "新增";
        this.orgDialog.formData = {};
      } else if (typeof scope == "string") {
        this.orgDialog.title = "新增";
        this.orgDialog.formData = {
          parentId: scope
        };
      } else {
        this.orgDialog.title = "编辑";
        this.orgDialog.formData = { ...scope };
      }
      this.$refs.deptFormRef && this.$refs.deptFormRef.resetFields();
      this.orgDialog.visible = true;
    },
    onSubmit() {
      this.$refs.deptFormRef.validate(async valid => {
        if (valid) {
          const reqData = {
            ...this.orgDialog.formData
          };
          let data;
          if (this.orgDialog.title == "编辑") {
            const id = reqData.id;
            delete reqData.id;
            delete reqData.pname;
            delete reqData.children;
            data = await this.$put(`/api/core/v1/org/${id}`, reqData);
          } else {
            data = await this.$post(`/api/core/v1/org`, reqData);
          }
          if (data) {
            this.$message.success("操作成功！");
            this.orgDialog.visible = false;
            this.getOrgs();
          }
        }
      });
    },
    async handleConfirmDelete(id) {
      const data = await this.$delete(`/api/core/v1/org/${id}`);
      if (data) {
        this.$message.success("操作成功！");
        this.getOrgs();
      }
    }
  }
};
</script>
