<template>
    <base-new-page
            title="Новая группа"
            index-route-name="indexGroup"
            index-label="Группы"
            resource="groups{/id}{/action_name}"
            form="group-form"
    />
</template>

<script>
  export default {
    name: 'GroupNewPage',
    middleware: 'auth'
  }
</script>
