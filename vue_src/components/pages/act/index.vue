<template>
    <base-index-page
            title="Акты"
            index-route-name="indexAct"
            new-route-name="newAct"
            edit-route-name="editAct"
            new-label="Добавить акт"
            resource="acts{/id}{/action_name}"
            grid="act-grid"
            id="act-index-page"
    />
</template>

<script>
  export default {
    name: 'ActIndexPage',
    middleware: 'auth'
  }
</script>
