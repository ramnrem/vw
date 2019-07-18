<template>
    <base-edit-page
            :title="title"
            index-route-name="indexPrintForm"
            index-label="Печатные формы"
            resource="print_forms{/id}{/action_name}"
            form="print-form-form"
            @fetch="handlerFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="print_form"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'PrintFormEditPage',
    middleware: 'auth',
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handlerFetch (model) {
        this.title = model.name
      },
    },
  }
</script>
