<template>
    <base-edit-page
            :title="title"
            index-route-name="indexAssistant"
            index-label="Ассистенты"
            resource="assistants{/id}{/action_name}"
            form="assistant-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="assistant"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'AssistantEditPage',
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
