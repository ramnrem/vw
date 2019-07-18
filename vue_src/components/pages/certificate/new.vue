<template>
    <base-new-page
            title="Новый сертификат"
            index-route-name="indexCertificate"
            index-label="Сертификаты"
            resource="certificates{/id}{/action_name}"
            form="certificate-form"
    />
</template>

<script>
  export default {
    name: 'CertificateNewPage',
    middleware: 'auth'
  }
</script>
