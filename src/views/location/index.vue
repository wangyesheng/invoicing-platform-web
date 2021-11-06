<template>
  <div class="content-wrap">
    <CRUD
      :query-config="{
        fields: {
          nbr: { control: 'input', label: '编号', value: '' },
          name: { control: 'input', label: '名称', value: '' },
        },
      }"
      :table-config="{
        columnAttrs: { align: 'center' },
        effect: {
          put: true,
          delete: true,
        },
      }"
      :urls="{
        view: '/api/discovery/view/kw/main',
        get: '/api/eims/v1/kw/query',
        post: '/api/eims/v1/kw',
        put: '/api/eims/v1/kw/:nbr',
        delete: '/api/eims/v1/kw/:nbr',
      }"
    />
  </div>
</template>
