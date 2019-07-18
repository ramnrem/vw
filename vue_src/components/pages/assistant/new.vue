<template>
    <base-new-page
            title="Новый ассистент"
            index-route-name="indexAssistant"
            index-label="Ассистенты"
            resource="assistants{/id}{/action_name}"
            form="assistant-form"
    />
</template>

<script>
  export default {
    name: 'AssistantNewPage',
    middleware: 'auth'
  }
</script>
