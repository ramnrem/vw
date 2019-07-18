<template>
    <base-index-page
            title="Услуги тренера"
            index-route-name="indexTrainerService"
            new-route-name="newTrainerService"
            edit-route-name="editTrainerService"
            new-label="Добавить услугу"
            resource="trainer_services{/id}{/action_name}"
            grid="trainer-service-grid"
            id="trainer-service-index-page"
    />
</template>

<script>
  export default {
    name: 'TrainerServiceIndexPage',
    middleware: 'auth'
  }
</script>
