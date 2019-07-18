<template>
    <base-new-page
            title="Новый договор"
            index-route-name="indexContract"
            index-label="Договора"
            resource="contracts{/id}{/action_name}"
            form="contract-form"
    />
</template>

<script>
  export default {
    name: 'ContractNewPage',
    middleware: 'auth'
  }
</script>
