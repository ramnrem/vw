<template>
    <base-index-page
            title="График отсутствий тренера"
            index-route-name="indexTrainerAbsence"
            new-route-name="newTrainerAbsence"
            edit-route-name="editTrainerAbsence"
            new-label="Добавить"
            resource="calendar/trainer_absences{/id}{/action_name}"
            grid="trainer-absence-grid"
            id="trainer-absence-index-page"
    />
</template>

<script>
  export default {
    name: 'TrainerAbsenceIndexPage',
    middleware: 'auth'
  }
</script>
