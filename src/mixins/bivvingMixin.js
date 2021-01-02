import {
  getRes
} from "@/api/api";

export default {
  data() {
    return {
      schema: {
        lines: [{
            field: "line",
            label: "行号"
          },
          {
            field: "part",
            label: "部件号"
          },
          {
            field: "desc",
            label: "部件描述"
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
            field: "price",
            label: "报价"
          }
        ]
      },
      lines: []
    };
  },
  methods: {
    async getLinesByNbr(nbr) {
      const data = await getRes('/api/plat/v2/biv/det', {
        "nbr": nbr
      });
      this.lines = (data || []).map(x => {
        x.date = x.date.slice(0, 10);
        return x;
      });
    }
  }
};
