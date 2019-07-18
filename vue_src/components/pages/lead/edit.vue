<template>
  <div>
    <base-edit-page
      :title="title"
      index-route-name="indexLead"
      index-label="Лиды"
      :resource="resource"
      form="lead-form"
      @fetch="handlerFetch"
      :menu="menu"
      ref="page"
    >
      <template slot="filter" slot-scope="scope">
        <resource-status-line :model="scope.model" states="lead"/>
      </template>
    </base-edit-page>

    <create-dialog
      ref="createAccountDialog"
      form="account-form"
      resource="accounts{/id}{/action_name}"
      title="Новый аккаунт"
      btn-label="Создать"
      :btn-hidden="true"
      :params="{ lead_id: model.id }"
      @create="handleCreateAccount"
    />

    <create-dialog
      ref="createContactDialog"
      form="contact-form"
      resource="contacts{/id}{/action_name}"
      title="Новый контакт"
      btn-label="Создать"
      :btn-hidden="true"
      :params="{ lead_id: model.id }"
      @create="handleCreateContact"
    />
  </div>
</template>

<script>
export default {
  name: "LeadEditPage",
  middleware: "auth",
  computed: {
    resource() {
      return this.$resource("leads{/id}{/action_name}");
    },
    menu() {
      return {
        label: "Действия",
        items: [
          {
            label: "Создать аккаунт",
            command: this.createAccount,
            hidden: this.menuCommandCreateAccountHidden
          },
          {
            label: "Создать контакт",
            command: this.createContact,
            hidden: this.menuCommandCreateContactHidden
          },
          { label: "Подтвердить", command: this.confirm },
          { label: "Отклонить", command: this.decline }
        ]
      };
    }
  },
  data() {
    return {
      title: "",
      model: {}
    };
  },
  methods: {
    handlerFetch(model) {
      this.title = model.label;
      this.model = model;
    },
    createAccount() {
      this.$refs.createAccountDialog.open();
    },
    createContact() {
      this.$refs.createContactDialog.open();
    },
    confirm(context) {
      this.resource
        .update({ id: this.model.id }, { method: "confirm" })
        .then((response) => {
          Object.assign(this.model, response.data)          
        });
    },
    decline(context) {
      this.resource
        .update({ id: this.model.id }, { method: "decline" })
        .then((response) => {
          Object.assign(this.model, response.data)          
        });
    },
    menuCommandCreateAccountHidden(model) {
      return model.account_id != null;
    },
    menuCommandCreateContactHidden(model) {
      return model.contact_id != null;
    },
    handleCreateAccount(accountId) {
      Object.assign(this.model, { account_id: accountId });
    },
    handleCreateContact(contactId) {
      Object.assign(this.model, { contact_id: contactId });
    }
  }
};
</script>
