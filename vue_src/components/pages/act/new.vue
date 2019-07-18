<template>
    <base-new-page
            title="Новый акт"
            index-route-name="indexAct"
            index-label="Акты"
            resource="acts{/id}{/action_name}"
            form="act-form"
    />
</template>

<script>
  export default {
    name: 'ActNewPage',
    middleware: 'auth'
  }
</script>
