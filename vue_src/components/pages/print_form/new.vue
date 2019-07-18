<template>
    <base-new-page
            title="Новая печатная форма"
            index-route-name="indexPrintForm"
            index-label="Печатные формы"
            resource="print_forms{/id}{/action_name}"
            form="print-form-form"
    />
</template>

<script>
  export default {
    name: 'PrintFormNewPage',
    middleware: 'auth'
  }
</script>
