<style lang="scss" scoped>
.content-wrap {
  ::v-deep {
    .custom-tree-node {
      span {
        margin-right: 10px;
      }
    }
  }
}
</style>
<template>
  <div class="content-wrap">
    <Query
      :config="{
        fields: {
          id: { control: 'input', label: '编号', value: '' },
          name: { control: 'input', label: '权限名称', value: '' },
          isActive: { control: 'input', label: '状态', value: '' },
        },
      }"
      @on-search="handleSearch"
    >
      <el-form-item slot="queryAction">
        <el-button type="primary" @click="handleShowDialog(null)">
          新增目录权限
        </el-button>
      </el-form-item>
    </Query>

    <el-card shadow="never">
      <el-table
        :data="permissionTable.treeData"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="desc" label="名称" />
        <el-table-column prop="name" label="标志">
          <template slot-scope="{ row }">
            <span> {{ row.name }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="层级">
          <template slot-scope="{ row }">
            <el-tag
              effect="plain"
              :type="row.level.type"
              :style="{ marginLeft: row.level.offest }"
            >
              {{ row.level.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态">
          <template slot-scope="{ row }">
            <el-tag :type="row.isActive == 1 ? 'primary' : 'info'">
              {{ row.isActive == 1 ? "有效" : "无效" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="handleShowDialog(row.id)"
              v-if="row.id.length == 3 || row.id.length == 6"
            >
              {{ row.id.length == 3 ? "新增菜单权限" : "新增按钮权限" }}
            </el-button>
            <el-button type="text" @click="handleShowDialog(row)">
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
      :title="permissionDialog.title"
      :visible.sync="permissionDialog.visible"
      :close-on-click-modal="false"
    >
      <dynamic-form
        ref="permissionFormRef"
        v-model="permissionDialog.formData"
        :descriptors="permissionDialog.formDescriptors"
      />
      <span slot="footer">
        <el-button @click="permissionDialog.visible = false">取 消</el-button>
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
        id: "",
        name: "",
        isActive: "",
      },
      permissionTable: {
        columns: [],
        data: [],
        treeData: [],
        total: 0,
      },
      permissionDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {},
      },
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getPermissions()]);
  },

  methods: {
    handleSearch(params) {
      this.queryCondition = params;
      this.getPermissions();
    },
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns },
      } = await this.$get("/api/discovery/view/fun/main");
      this.permissionDialog.formDescriptors =
        this.renderFormDescriptors(descriptors);
      this.permissionTable.columns = columns;
    },
    async getPermissions() {
      const data = await this.$get(
        "/api/core/v1/fun/query",
        this.queryCondition
      );
      this.permissionTable.data = data;
      this.permissionTable.treeData = data
        .filter((x) => !x.parentId)
        .map((x) => ({
          ...x,
          level: {
            type: "warning",
            label: "目录",
          },
          children: [],
        }));
      for (let i = 0; i < data.length; i++) {
        const layer = data[i];
        if (layer.parentId) {
          this.walk(layer, this.permissionTable.treeData);
        }
      }
    },
    walk(layer, source) {
      for (let i = 0; i < source.length; i++) {
        if (layer.parentId == source[i].id) {
          source[i].children.push({
            ...layer,
            level:
              layer.id.length == 6
                ? {
                    type: "success",
                    label: "菜单",
                    offest: "10px",
                  }
                : {
                    type: "danger",
                    label: "按钮",
                    offest: "20px",
                  },
            children: [],
          });
        } else {
          this.walk(layer, source[i].children);
        }
      }
    },
    handleShowDialog(scope) {
      if (scope == null) {
        this.permissionDialog.title = "新增";
      } else if (typeof scope == "string") {
        this.permissionDialog.title = "新增";
        this.permissionDialog.formData = {
          parentId: scope,
        };
      } else {
        this.permissionDialog.title = "编辑";
        this.permissionDialog.formData = { ...scope };
      }
      this.$refs.permissionFormRef &&
        this.$refs.permissionFormRef.resetFields();
      this.permissionDialog.visible = true;
    },
    onSubmit() {
      this.$refs.permissionFormRef.validate(async (valid) => {
        if (valid) {
          const reqData = {
            ...this.permissionDialog.formData,
          };
          let data;
          if (this.permissionDialog.title == "新增") {
            data = await this.$post(`/api/core/v1/fun`, reqData);
          } else {
            delete reqData.id;
            delete reqData.pName;
            delete reqData.level;
            delete reqData.children;
            data = await this.$put(
              `/api/core/v1/fun/${this.permissionDialog.formData.id}`,
              reqData
            );
          }
          if (data) {
            this.$message.success("操作成功！");
            this.permissionDialog.visible = false;
            this.getPermissions();
          }
        }
      });
    },
    async handleConfirmDelete(id) {
      const data = await this.$delete(`/api/core/v1/fun/${id}`);
      if (data) {
        this.$message.success("操作成功！");
        this.getPermissions();
      }
    },
  },
};
</script>
