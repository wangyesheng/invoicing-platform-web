export default {
  data() {
    return {
      schema: {
        lines: [
          {
            field: "shipNbr",
            label: "发货单"
          },{
            field: "line",
            label: "行号"
          },
          {
            field: "part",
            label: "部件号"
          },{
            field: "desc",
            label: "部件名"
          },
          {
            field: "ordQty",
            label: "订单数量"
          },
          {
            field: "qty",
            label: "收货数量"
          },
          {
            field: "um",
            label: "单位"
          },
          {
            field: "date",
            label: "收货日期"
          }
        ]
      },
      lines: []
    };
  },
  methods: {
    async getLinesByNbr(nbr) {
      const data = await this.$get("/api/plat/v2/receipt/det", {
        nbr
      });
      this.lines = (data || []).map(x => {
        x.date = x.date.slice(0, 10);
        return x;
      });
    }
  }
};
