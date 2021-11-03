<template>
  <div class="content-wrap">
    <CRUD
      :query-config="{
        fields: {
          nbr: { control: 'input', label: '编号', value: '' },
          part: { control: 'input', label: '部件编号', value: '' },
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
        view: '/api/discovery/view/stock/main',
        get: '/api/eims/v1/stock/query',
      }"
    />
  </div>
</template>

