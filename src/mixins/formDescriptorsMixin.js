export default {
  methods: {
    renderFormDescriptors(descriptors) {
      for (const key in descriptors) {
        const layer = descriptors[key];
        if (layer.control) {
          layer.component = {
            name: "el-radio-group", // required
            children: layer.source.map((x) => ({
              name: "el-radio",
              props: {
                label: x.value, // value
              },
              children: x.label,
            })),
          };
        } else {
          continue;
        }
      }
      return descriptors
    }
  }
}
