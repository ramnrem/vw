<template>
    <base-index-page
            title="Договора"
            index-route-name="indexContract"
            new-route-name="newContract"
            edit-route-name="editContract"
            new-label="Новый договор"
            resource="contracts{/id}{/action_name}"
            grid="contract-grid"
            id="contract-index-page"
    />
</template>

<script>
  export default {
    name: 'ContractIndexPage',
    middleware: 'auth'
  }
</script>
