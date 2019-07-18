<template>
    <base-new-page
            title="Новая услуга"
            index-route-name="indexTrainerService"
            index-label="Услуги тренера"
            resource="trainer_services{/id}{/action_name}"
            form="trainer-service-form"
    />
</template>

<script>
  export default {
    name: 'TrainerServiceNewPage',
    middleware: 'auth'
  }
</script>
