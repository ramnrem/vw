<template>
    <base-edit-page
            :title="title"
            index-route-name="indexActivity"
            index-label="Мои дела"
            resource="activities{/id}{/action_name}"
            form="activity-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model" states="activity"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'ActivityEditPage',
    middleware: 'auth',
    data() {
      return {
        title: ''
      }
    },
    methods: {
      handleFetch (model) {
        this.title = model.label
      }
    },
  }
</script>
