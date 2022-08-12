<template>
  <div class="content-wrap">
    <CRUD
      :query-config="{
        fields: {
          nbr: { control: 'input', label: '编号', value: '' },
          part: { control: 'input', label: '医疗器械编号', value: '' },
          timerange: {
            control: 'date',
            label: '时间区间',
            value: '',
            mapFields: { [0]: 'startTime', [1]: 'endTime' }
          }
        }
      }"
      :table-config="{
        columnAttrs: { align: 'center' },
        effect: {
          put: false,
          delete: false
        }
      }"
      :urls="{
        view: '/api/discovery/view/inventory/main',
        get: '/api/eims/v1/inventory/query',
        post: '/api/eims/v1/inventory'
      }"
    />
  </div>
</template>
