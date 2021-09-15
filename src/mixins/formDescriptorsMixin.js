export default {
  methods: {
    renderFormDescriptors(descriptors) {
      for (const key in descriptors) {
        const layer = descriptors[key];
        layer.control && renderControl(layer, this);
      }
      return descriptors
    }
  }
}

const renderControl = async (scope, vm) => {
  switch (scope.control) {
    case 'radio':
      scope.component = {
        name: "el-radio-group", // required
        children: scope.source.map((x) => ({
          name: "el-radio",
          props: {
            label: x.value, // value
          },
          children: x.label,
        })),
      };
      break;
    case 'select':
      scope.message = `请选择${scope.label}`;
      scope.component = {
        name: "el-select", // required
        props: {
          placeholder: `请选择${scope.label}`,
        },
        children: await getData(scope.dataUrl, vm)
      };
      break;
    default:
      break;
  }
}

const getData = async (url, vm) => {
  const data = await vm.$get(url)
  return data.map(x => ({
    name: "el-option",
    props: {
      ...x,
      label: x.name,
      value: x.nbr,
    },
  }))
}
