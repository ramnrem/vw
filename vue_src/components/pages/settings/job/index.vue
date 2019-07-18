<template>
    <base-index-page
            class="jobs"
            title="Задачи"
            index-route-name="indexJob"
            new-route-name="newJob"
            edit-route-name="editJob"
            new-label="Добавить задачу"
            resource="jobs{/id}{/action_name}"
    />
</template>

<script>
  export default {
    name: 'JobIndexPage',
    middleware: 'auth'
  }
</script>
