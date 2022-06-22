export default {
  mounted() {
    this.dateFields = [];
    this.needOperator = false;
  },

  methods: {
    renderFormDescriptors(descriptors) {
      const _descriptors = {};
      for (const key in descriptors) {
        const layer = descriptors[key];
        if (layer.isShow !== false) {
          _descriptors[key] = layer;
          // 解决表单字段是 date 类型之后编辑时需要 new Date 包装下
          if (layer.type == "date") {
            this.dateFields.push(key);
          }
          if (key == "operator") {
            this.needOperator = true;
          }
          layer.control && renderControl(layer, this);
        }
      }
      return _descriptors;
    }
  }
};

const renderControl = async (scope, vm) => {
  switch (scope.control) {
    case "radio":
      scope.component = {
        name: "el-radio-group", // required
        children: scope.source.map(x => ({
          name: "el-radio",
          props: {
            label: x.value // value
          },
          children: x.label
        }))
      };
      break;
    case "select":
      scope.message = `请选择${scope.label}`;
      scope.component = {
        name: "el-select", // required
        props: {
          placeholder: `请选择${scope.label}`,
          clearable: true,
          filterable: true
        },
        children: await getData(scope.dataUrl, scope.propsMap, vm)
      };
      break;
    default:
      break;
  }
};

const getData = async (url, propsMap = {}, vm) => {
  const data = await vm.$get(url.replace("plat/v2", "eims/v1"));
  return data.map(x => ({
    name: "el-option",
    props: {
      ...x,
      label: x[propsMap.label],
      value: x[propsMap.value]
    }
  }));
};
