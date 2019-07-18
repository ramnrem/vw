<template>
    <base-new-page
            title="Новое дело"
            index-route-name="indexActivity"
            index-label="Мои дела"
            resource="activities{/id}{/action_name}"
            form="activity-form"
    />
</template>

<script>
  export default {
    name: 'ActivityNewPage',
    middleware: 'auth'
  }
</script>
