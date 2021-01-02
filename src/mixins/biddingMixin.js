export default {
  data() {
    return {
      schema: {
        lines: [
          {
            field: "line",
            label: "行号"
          },
          {
            field: "part",
            label: "部件号"
          },
          {
            field: "price",
            label: "底价"
          },
          {
            field: "qty",
            label: "数量"
          },
          {
            field: "um",
            label: "单位"
          },
          {
            field: "date",
            label: "日期"
          }
        ]
      },
      lines: []
    };
  },
  methods: {
    async getLinesByNbr(nbr) {
      const data = await this.$get("/api/plat/v2/bid/det", {
        nbr
      });
      this.lines = (data || []).map(x => {
        x.date = x.date.slice(0, 10);
        return x;
      });
    }
  }
};
