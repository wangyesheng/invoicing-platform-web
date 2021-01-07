// 招标状态
export const BIDDING_STATES = [
  {
    label: "建标中",
    value: 0,
    tag: "gray"
  },
  {
    label: "有效标",
    value: 1,
    tag: "blue"
  },
  {
    label: "已发标",
    value: 2,
    tag: "orange"
  },
  {
    label: "已投标",
    value: 3,
    tag: "magenta"
  },
  {
    label: "已开标",
    value: 4,
    tag: "green"
  }
];

// 竞标状态
export const BIVVING_STATES = [
  {
    label: "待竞标",
    value: 0,
    tag: "gray"
  },
  {
    label: "已保存",
    value: 1,
    tag: "blue"
  },
  {
    label: "已竞标",
    value: 2,
    tag: "orange"
  },
  {
    label: "已中标",
    value: 3,
    tag: "green"
  }
];

// 采购合同状态
export const PO_STATES = [
  {
    label: "建单中",
    value: 0,
    tag: "gray"
  },
  {
    label: "有效单",
    value: 1,
    tag: "blue"
  }
];

// 物流公司
export const EXPRESSCOM = [
  {
    label: "顺丰速运",
    value: 'SF',
    tag: "gray"
  },
  {
    label: "圆通速递",
    value: 'YTO',
    tag: "blue"
  },
  {
    label: "申通快递",
    value: 'STO',
    tag: "orange"
  },
  {
    label: "百世快递",
    value: 'HTKY',
    tag: "green"
  },
  {
    label: "德邦快递",
    value: 'DBL',
    tag: "green"
  }
];
