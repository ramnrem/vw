<template>
    <base-index-page
            title="Ассистенты"
            index-route-name="indexAssistant"
            resource="assistants{/id}{/action_name}"
            new-route-name="newAssistant"
            edit-route-name="editAssistant"
            new-label="Добавить ассистента"
            grid="assistant-grid"
    />
</template>

<script>
  export default {
    name: 'AssistantIndexPage',
    middleware: 'auth'
  }
</script>
