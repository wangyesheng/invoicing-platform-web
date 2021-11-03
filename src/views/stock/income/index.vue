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
          <el-button type="primary"> 查询 </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleShowDialog(null)">
            盘点
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <eos-dynamic-table
        :columns="incomeTable.columns"
        :data="incomeTable.data"
      >
        <!-- <el-table-column slot="action" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleShowDialog(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleConfirmDelete(row.orgid)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column> -->
      </eos-dynamic-table>
    </el-card>
    <el-dialog
      width="30%"
      :title="incomeDialog.title"
      :visible.sync="incomeDialog.visible"
      :close-on-click-modal="false"
    >
      <dynamic-form
        ref="incomeFormRef"
        v-model="incomeDialog.formData"
        :descriptors="incomeDialog.formDescriptors"
      />
      <span slot="footer">
        <el-button @click="incomeDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import formDescriptorsMixin from "@/mixins/formDescriptorsMixin";
import { mapGetters } from "vuex";

export default {
  mixins: [formDescriptorsMixin],

  data() {
    return {
      queryCondition: {
        nbr: "",
        part: "",
        startTime: "",
        endTime: ""
      },
      incomeTable: {
        columns: [],
        data: [],
        total: 0
      },
      incomeDialog: {
        title: "",
        visible: false,
        formDescriptors: {},
        formData: {}
      }
    };
  },

  computed: {
    ...mapGetters(["userinfo"])
  },

  mounted() {
    Promise.all([this.getMianView(), this.getData()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns }
      } = await this.$get("/api/discovery/view/income/main");
      this.incomeDialog.formDescriptors = this.renderFormDescriptors(
        descriptors
      );
      this.incomeTable.columns = columns;
    },
    async getData() {
      const data = await this.$get(
        "/api/eims/v1/income/query",
        this.queryCondition
      );
      this.incomeTable.data = data;
    },
    handleShowDialog(scope) {
      if (scope == null) {
        this.incomeDialog.title = "新增";
        this.incomeDialog.formData = {
          operator: this.userinfo.account,
          _operator: this.userinfo.userId
        };
      }
      this.$refs.incomeFormRef && this.$refs.incomeFormRef.resetFields();
      this.incomeDialog.visible = true;
    },
    onSubmit() {
      this.$refs.incomeFormRef.validate(async valid => {
        if (valid) {
          const reqData = {
            ...this.incomeDialog.formData,
            operator: this.incomeDialog.formData._operator
          };
          Object.keys(reqData).forEach(key => {
            if (key.startsWith("_")) delete reqData[key];
          });
          const data = await this.$post(`/api/eims/v1/income`, reqData);
          if (data) {
            this.$message.success("操作成功！");
            this.incomeDialog.visible = false;
            this.getData();
          }
        }
      });
    }
  }
};
</script>
