<style lang="scss" scoped>
.dashboard-container {
  & ::v-deep {
    .el-table__row {
      .cell {
        img {
          width: 50px;
          height: 50px;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>

<template>
  <div class="dashboard-container">
    <dynamic-form
      ref="dynamic-form"
      v-model="userForm.data"
      :descriptors="userForm.descriptors"
    />
    <!-- <DynamicTable border :data="userTable.data" :columns="userTable.columns">
      <h1 slot="petters" slot-scope="{ petters }">{{ petters }}</h1>
    </DynamicTable> -->
  </div>
</template>

<script>
import DynamicTable from "@/components/DynamicTable";

//
const schemas = {
  // 路由的 name 属性作为每个页面匹配的 key
  Dashboard: {
    list: {
      ui: {
        columns: [],
      },
    },
  },
};

const areas = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const dicts = {
  gender: [],
  pettes: [],
};

export default {
  name: "Dashboard",
  components: {
    DynamicTable,
  },
  data() {
    return {
      userForm: {
        descriptors: {
          username: {
            type: "string", //
            label: "用户名", //
            required: true, //
            message: "请输入用户名",
            // props: {
            //   placeholder: "请输入用户名",
            //   maxlength: 10,
            //   "show-word-limit": true,
            // },
          },

          age: {
            type: "number",
            label: "年龄",
            required: true,
            message: "请输入年龄",
            props: {
              placeholder: "请输入用户名",
            },
          },

          gender: {
            type: "number",
            label: "性别",
            required: true,

            // message: "请选择性别",

            // control: "radio",
            // source: [
            //   { value: 0, label: "男" },
            //   { value: 1, label: "女" },
            // ],

            component: {
              name: "el-radio-group", // required
              children: [
                {
                  name: "el-radio", // required
                  props: {
                    label: 0, // value
                  },
                  children: "男", // 释义
                },
                {
                  name: "el-radio",
                  props: {
                    label: 1,
                  },
                  children: "女",
                },
              ],
            },
          },
          roles: {
            type: "string",
            label: "角色",
            required: true,

            control: "select",
            options: [
              { label: "管理员", value: "ADMIN" },
              { label: "测试", value: "TEST" },
            ],

            // component: {
            //   name: "el-select", // required
            //   // props: {
            //   //   placeholder: "请选择角色",
            //   // },
            //   children: [
            //     {
            //       name: "el-option",
            //       props: {
            //         label: "管理员",
            //         value: "ADMIN",
            //       },
            //     },
            //     {
            //       name: "el-option",
            //       props: {
            //         label: "测试",
            //         value: "TEST",
            //       },
            //     },
            //   ],
            // },
          },
          createTime: {
            type: "date",
            label: "注册时间",
            required: true,
            message: "请选择注册时间",
            props: {
              placeholder: "请选择注册时间",
            },
          },
          address: {
            type: "array",
            label: "地址",
            required:true,
            // control: "select",
            // source:areas
            component: {
              name: "el-cascader", // 
              props: {
                options: areas,
                props: { expandTrigger: "hover" },
                placeholder: "请选择地址",
              },
            },
          },
          hobbies: {
            type: "array", 
            label: "爱好",
            required: true,

            control: "select",
            multiple:true,
            options: [
              { label: "管理员", value: "ADMIN" },
              { label: "测试", value: "TEST" },
            ],


            component: {
              name: "el-select",
              props: {
                multiple: true,
              },
              children: [
                {
                  name: "el-option",
                  props: {
                    label: "篮球",
                    value: "baskteball",
                  },
                },
                {
                  name: "el-option",
                  props: {
                    label: "网球",
                    value: "nestball",
                  },
                },
                {
                  name: "el-option",
                  props: {
                    label: "足球",
                    value: "footerball",
                  },
                },
              ],
            },
          },
          status: { type: "boolean", label: "状态",required:true },
          pettes: {
            type: "array",
            label: "宠物",
            required: true,
            control: "checkbox",
            options: [
              { label: "柯基基", value: "dogger" },
              { label: "测试", value: "TEST" },
            ],
            component: {
              name: "el-checkbox-group",
              children: [
                {
                  name: "el-checkbox",
                  props: {
                    label: "dogger",
                  },
                  children: "柯基基",
                },
                {
                  name: "el-checkbox",
                  props: {
                    label: "catter",
                  },
                  children: "英短短",
                },
              ],
            },
          },
          timerScope: {
            type: "array",
            label: "时间范围",
            component: {
              name: "el-date-picker",
              props: {
                type: "datetimerange",
                "range-separator": "至",
                "start-placeholder": "开始日期",
                "end-placeholder": "结束日期",
                clearable: true,
              },
            },
          },
        },
        data: {},
      },
      userTable: {
        columns: [],
        data: [],
      },
      queryCondition: {},
    };
  },

  mounted() {
    this.getUsers();
  },

  methods: {
    getUsers() {
      const user = {
        avatar:
          "https://img0.baidu.com/it/u=2890391606,2002435283&fm=26&fmt=auto&gp=0.jpg",
        username: "Ann",
        age: 18,
        gender: 1,
        roles: "管理员",
        createTime: "2021-08-16",
        address: "江苏省南通市通州区金新街道万科时光映翠",
        hobbies: ["篮球", "网球"],
        status: 2,
        pettes: ["柯基", "英短"],
      };
      const response = {
        code: 200,
        msg: "fetch successfully",
        data: Array(10).fill(user),
        ui: {
          columns: [
            { prop: "avatar", label: "头像", renderMode: "img" },
            { prop: "username", label: "姓名", renderMode: "link" },
            { prop: "age", label: "年龄" },
            {
              prop: "gender",
              label: "性别",
              renderMode: "tag",
              source: {
                [1]: { label: "男", type: "primary" },
                [0]: { label: "女", type: "danger" },
              },
            },
            { prop: "roles", label: "角色" },
            { prop: "createTime", label: "注册时间" },
            { prop: "address", label: "居住地" },
            { prop: "hobbies", label: "爱好", renderMode: "array" },
            {
              prop: "status",
              label: "账号状态",
              renderMode: "tag",
              source: {
                [0]: { label: "未审核", type: "info" },
                [1]: { label: "通过", type: "primary" },
                [2]: { label: "拒绝", type: "danger" },
              },
            },
            { prop: "pettes", label: "宠物", renderMode: "array" },
          ],
        },
      };
      this.userTable.data = response.data;
      this.userTable.columns = response.ui.columns;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
