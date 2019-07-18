<template>
    <base-index-page
            title="Контакты"
            index-route-name="indexContact"
            new-route-name="newContact"
            edit-route-name="editContact"
            new-label="Добавить контакт"
            resource="contacts{/id}{/action_name}"
            grid="contact-grid"
            id="contract-index-page"
    />
</template>

<script>
  export default {
    name: 'ContactIndexPage',
    middleware: 'auth'
  }
</script>
