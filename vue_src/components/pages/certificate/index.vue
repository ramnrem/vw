<template>
    <base-index-page
            title="Сертификаты"
            index-route-name="indexCertificate"
            new-route-name="newCertificate"
            edit-route-name="editCertificate"
            new-label="Добавить сертификат"
            resource="certificates{/id}{/action_name}"
            grid="certificate-grid"
    />
</template>

<script>
  export default {
    name: 'CertificateIndexPage',
    middleware: 'auth'
  }
</script>
