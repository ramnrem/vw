<template>
    <base-edit-page
            :title="title"
            index-route-name="indexTrainer"
            index-label="Тренеры"
            resource="trainers{/id}{/action_name}"
            form="trainer-form"
            @fetch="handleFetch"
    >
        <template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="trainer" resource="trainers{/id}{/action_name}"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'TrainerEditPage',
    middleware: 'auth',    
    data () {
      return {
        title: '',
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.label
      }
    },
  }
</script>
