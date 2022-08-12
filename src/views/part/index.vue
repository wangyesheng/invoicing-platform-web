<template>
  <div class="content-wrap">
    <CRUD
      :query-config="{
        fields: {
          desc: { control: 'input', label: '名称', value: '' },
          com: { control: 'input', label: '厂家', value: '' }
        }
      }"
      :table-config="{
        columnAttrs: { align: 'center' },
        effect: {
          put: true,
          delete: true
        }
      }"
      :urls="{
        view: '/api/discovery/view/part/main',
        get: '/api/eims/v1/part/query',
        post: '/api/eims/v1/part',
        put: '/api/eims/v1/part/:part',
        delete: '/api/eims/v1/part/:part'
      }"
    />
  </div>
</template>
