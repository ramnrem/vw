<template>
    <base-edit-page
            :title="title"
            index-route-name="indexContact"
            index-label="Контакты"
            resource="contacts{/id}{/action_name}"
            form="contact-form"
            @fetch="handleFetch"
    ><template slot="filter" slot-scope="scope">
            <resource-status-line :model="scope.model"  states="contact"/>
        </template>
    </base-edit-page>
</template>

<script>
  export default {
    name: 'ContactEditPage',
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
