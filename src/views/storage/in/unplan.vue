<template>
  <div class="content-wrap">
    <CRUD
      :query-config="{
        fields: {
          nbr: { control: 'input', label: '编号', value: '' },
          part: { control: 'input', label: '部件编号', value: '' },
          timerange: {
            control: 'date',
            label: '时间区间',
            value: '',
            mapFields: { [0]: 'startTime', [1]: 'endTime' },
          },
        },
      }"
      :table-config="{
        columnAttrs: { align: 'center' },
        effect: {
          put: false,
          delete: false,
        },
      }"
      :urls="{
        view: '/api/discovery/view/unplan/main',
        get: '/api/eims/v1/receipt/unplan',
        post: '/api/eims/v1/receipt/unplan',
      }"
    />
  </div>
</template>


