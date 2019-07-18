<template>
    <base-new-page
            title="Новый график"
            index-route-name="indexTrainerAbsence"
            index-label="График отсутствий тренера"
            resource="calendar/trainer_absences{/id}{/action_name}"
            form="trainer-absence-form"
    />
</template>

<script>
  export default {
    name: 'TrainerAbsenceNewPage',
    middleware: 'auth'
  }
</script>
