export default {
  data() {
    return {
      schema: {
        lines: [{
            field: "poNbr",
            label: "采购单"
          }, {
            field: "shipNbr",
            label: "发货单"
          }, {
            field: "rcptNbr",
            label: "收货单"
          }, {
            field: "line",
            label: "行号"
          },
          {
            field: "part",
            label: "部件号"
          }, {
            field: "desc",
            label: "部件名"
          },
          {
            field: "ordQty",
            label: "订单数量"
          },
          {
            field: "rcptQty",
            label: "收货数量"
          },
          {
            field: "qty",
            label: "开票数量"
          },
          {
            field: "um",
            label: "单位"
          },
          {
            field: "date",
            label: "开票日期"
          }
        ]
      },
      lines: []
    };
  },
  methods: {
    async getLinesByNbr(nbr) {
      const data = await this.$get("/api/plat/v2/invoice/det", {
        nbr
      });
      this.lines = (data || []).map(x => {
        x.date = x.date.slice(0, 10);
        return x;
      });
    }
  }
};
