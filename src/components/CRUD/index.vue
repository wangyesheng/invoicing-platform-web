<template>
  <div class="crud-wrap">
    <Query />
    <Table />
    <Effect />
  </div>
</template>

<script>
import Table from "./container/Table";
import Effect from "./Effect";
import Query from "./Query";

export default {
  components: {
    Table,
    Effect,
    Query
  }
};
</script>
