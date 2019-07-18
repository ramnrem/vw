<template>
    <base-index-page
            title="Печатные формы"
            index-route-name="indexPrintForm"
            new-route-name="newPrintForm"
            edit-route-name="editPrintForm"
            new-label="Добавить печатную форму"
            resource="print_forms{/id}{/action_name}"
            grid="print-form-grid"
            id="print-form-index-page"
    />
</template>

<script>
  export default {
    name: 'PrintFormIndexPage',
    middleware: 'auth'
  }
</script>
