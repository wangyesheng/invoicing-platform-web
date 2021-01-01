import { getBiddingLinesByNbrRes } from "@/api/bidding";

export default {
  data() {
    return {
      schema: {
        lines: [
          { field: "line", label: "行号" },
          { field: "part", label: "部件号" },
          { field: "price", label: "招标底价" },
          { field: "qty", label: "招标数量" },
          { field: "um", label: "单位" },
          { field: "date", label: "招标日期" }
        ]
      },
      biddingLines: []
    };
  },
  methods: {
    async getBiddingLinesByNbr(nbr) {
      const data = await getBiddingLinesByNbrRes(nbr);
      this.biddingLines = (data || []).map(x => {
        x.date = x.date.slice(0, 10);
        return x;
      });
    }
  }
};
