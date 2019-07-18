<template>
    <base-index-page
            title="Лиды"
            index-route-name="indexLead"
            new-route-name="newLead"
            edit-route-name="editLead"
            new-label="Добавить лид"
            :resource="resource"
            grid="lead-grid"
            :context-menu="contextMenu"
            id="lead-index-page"
            ref="grid"
    />
</template>

<script>
  export default {
    name: 'LeadIndexPage',
    middleware: 'auth',
    computed: {
      resource () {
        return this.$resource('leads{/id}{/action_name}')
      },
      contextMenu () {
        return [
          { label: 'Редактировать', command: this.edit, primary: true },
          { label: 'Подтвердить', command: this.confirm },
          { label: 'Отклонить', command: this.decline },
          { label: 'Создать аккаунт', command: this.createAccount, hidden: this.hideAccountMenuItem },
          { label: 'Создать контакт', command: this.createContact, hidden: this.hideContactMenuItem },
          { label: 'Создать кост-прайс', command: this.createCostPrice, hidden: this.hideCostPriceMenuItem },
          { label: 'Удалить', command: this.remove, hidden: this.hideRemoveMenuItem },
          { label: 'Восстановить', command: this.remove, hidden: this.hideRestoreMenuItem }
        ]
      },
    },
    methods: {
      edit (context) {
        this.$router.push({ name: 'editLead', params: { id: context.id } })
      },
      confirm (context) {
        this.resource.update({ id: context.id }, { method: 'confirm' }).then(() => {
          this.$refs.grid.refresh()
        })
      },
      decline (context) {
        this.resource.update({ id: context.id }, { method: 'decline' }).then(() => {
          this.$refs.grid.refresh()
        })
      },
      remove (context) {
        this.resource.remove({ id: context.id }).then(() => {
          this.$refs.grid.refresh()
        })
      },
      createAccount (context) {
        this.$router.push({ name: 'newAccount', query: { lead_id: context.id } })
      },
      createContact (context) {
        this.$router.push({ name: 'newContact', query: { lead_id: context.id } })
      },
      createCostPrice (context) {
        this.$router.push({ name: 'newCostPrice', query: { lead_id: context.id } })
      },
      hideAccountMenuItem (context) {
        return !!context.account || this.hideRemoveMenuItem(context)
      },
      hideContactMenuItem (context) {
        return !!context.contact || this.hideRemoveMenuItem(context)
      },
      hideCostPriceMenuItem (context) {
        return !!context.cost_price || this.hideRemoveMenuItem(context)
      },
      hideRemoveMenuItem (context) {
        return context.aasm_state.id === 'deleted'
      },
      hideRestoreMenuItem (context) {
        return context.aasm_state.id !== 'deleted'
      }
    },
  }
</script>
