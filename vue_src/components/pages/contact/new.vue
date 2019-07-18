<template>
    <base-new-page
            title="Новый контакт"
            index-route-name="indexContact"
            index-label="Контакты"
            resource="contacts{/id}{/action_name}"
            form="contact-form"
    />
</template>

<script>
  export default {
    name: 'ContactNewPage',
    middleware: 'auth'    
  }
</script>
