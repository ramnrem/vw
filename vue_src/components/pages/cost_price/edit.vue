<template>
<div>
  <base-edit-page
    ref="page"
    :title="title"
    index-route-name="indexCostPrice"
    index-label="Кост-прайсы"
    :resource="resource"
    form="cost-price-form"
    @fetch="handleFetch"
    :menu="menu"
  >
    <template slot="filter" slot-scope="scope">
      <resource-status-line
        :model="scope.model"
        states="cost_price"
        resource="cost_prices{/id}{/action_name}"
      />
    </template>
  </base-edit-page>
  <el-dialog
  title="Код виджета формы регистрации"
  :visible.sync="dialogWidgetVisible"
  width="70%">  
  <el-input type="textarea" v-model="widgetCode" :readonly="true" rows="4" />
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogWidgetVisible = false">Закрыть</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  name: "CostPriceEditPage",
  middleware: "auth",  
  computed: {
    resource() {
      return this.$resource("cost_prices{/id}{/action_name}");
    },
    menu() {
      return {
        label: "Действия",
        items: [
          {
            label: "Создать копию",
            command: this.createCopy
          },
          {
            label: "Выписать счет",
            command: this.createInvoice,
            hidden: this.menuCommandCreateInvoiceHidden
          },
          {
            label: "Опросный лист",
            command: this.createEvaluation
          },
          {
            label: "Код виджета формы регистрации",
            command: this.showRegistrationWidget,
            hidden: this.menuCommandShowRegistrationWidgetHidden
          },
        ]
      };
    }
  },
  data() {
    return {
      dialogWidgetVisible: false,
      title: "",
      widgetCode: ""
    };
  },
  created(){
    this.widgetCode = '<link href="https://reg.cbsd.ru/widget/main.css" rel=stylesheet>\n'
    this.widgetCode += `<vue-registration-widget cost-price-id="${this.$route.params.id}"/>\n`
    this.widgetCode += '<script src=\"https://reg.cbsd.ru/widget/main.js\"><\/script>'
    
  },
  methods: {
    handleFetch(model) {
      this.title = model.label;
    },
    createCopy() {
      this.resource
        .save(
          {
            id: this.$refs.page.model.id,
            action_name: "copy"
          },
          {}
        )
        .then(response => {
          this.$refs.page.resetChangedState();
          this.$message.success("Документ скопирован");
          this.$router.push({
            name: "editCostPrice",
            params: {
              id: response.data.result.id
            }
          });
        })
        .catch(response => {
          if (response.status === 422) {
            this.$message.error({
              dangerouslyUseHTMLString: true,
              message: response.data.full_messages.join("<br/>"),
              duration: 6000
            });
          } else {
            this.$message.error(response.data.message || response.statusText);
          }
        });
    },
    createInvoice() {
      let routeData = this.$router.resolve({
        name: "newInvoice",
        query: {
          cost_price_id: this.$refs.page.model.id,
          redirect: this.$route.fullPath
        }
      });
      window.open(routeData.href, "_blank");
    },
    createEvaluation() {
      this.$router.push({
        name: "newEvaluation",
        query: {
          cost_price_id: this.$refs.page.model.id,
          redirect: this.$route.fullPath
        }
      });
    },
    showRegistrationWidget(){
      this.dialogWidgetVisible = true
    },
    menuCommandCreateInvoiceHidden(model) {
      return model && model.code == 'OE'
    },
    menuCommandShowRegistrationWidgetHidden(model) {
      return model && model.code != 'OE' && model.code != 'EV'
    }
  }
};
</script>
