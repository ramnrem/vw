<template>
  <div>
    <base-index-page
      title="Кост-прайсы"
      index-route-name="indexCostPrice"
      new-route-name="newCostPrice"
      edit-route-name="editCostPrice"
      new-label="Добавить кост-прайс"
      :resource="resource"
      grid="cost-price-grid"
      :context-menu="contextMenu"
      ref="grid"
    />
    <el-dialog :visible.sync="disaplyReasonDialog" title="Укажите причину удаления" append-to-body>
      <el-form :model="reasonCancellation" :rules="rules" ref="reasonCancellationForm">
        <el-form-item prop="reason_cancellation_id" label="Причина">
          <enumeration
            v-model="reasonCancellation.reason_cancellation_id"
            code="reason_cancellation"
          />
        </el-form-item>
        <el-form-item prop="reason_cancellation_comment" label="Комментарий">
          <el-input v-model="reasonCancellation.reason_cancellation_comment"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormDelete" :loading="loading">Удалить</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CostPriceIndexPage",
  middleware: "auth",
  data() {
    return {
      loading: false,
      disaplyReasonDialog: false,
      reasonCancellation: {
        id: null,
        reason_cancellation_id: null,
        reason_cancellation_comment: null
      },
      rules: {
        reason_cancellation_id: [
          { required: true, message: "не может быть пустым" }
        ],
        reason_cancellation_comment: [
          { required: true, message: "не может быть пустым" }
        ]
      }
    };
  },
  computed: {
    resource() {
      return this.$resource("cost_prices{/id}{/action_name}");
    },
    contextMenu() {
      return [
        { label: "Редактировать", command: this.edit, primary: true },
        {
          label: "Восстановить",
          command: this.remove,
          hidden: this.hideRestoreMenuItem
        },
        {
          label: "Удалить",
          command: this.remove,
          hidden: this.hideRemoveMenuItem
        }
      ];
    }
  },
  methods: {
    edit(context) {
      this.$router.push({
        name: "editCostPrice",
        params: { id: context.id },
        query: {
          redirect: this.$route.fullPath
        }
      });
    },
    remove(context) {
      var states = ["deleted"];
      if (!states.includes(context.aasm_state.id)) {
        this.reasonCancellation = Object.assign({}, {
          id: context.id,
          reason_cancellation_id: null,
          reason_cancellation_comment: null
        });        
        this.disaplyReasonDialog = true;        
      } else {
        this.resource
          .remove({ id: context.id })
          .then(() => {
            this.$refs.grid.refresh();
          })
          .catch(response => {
            if (response.status === 422) {
              this.$message.error({
                dangerouslyUseHTMLString: true,
                message: response.data.full_messages.join("<br/>"),
                duration: 6000
              });
            } else {
              this.$message.error({
                dangerouslyUseHTMLString: true,
                message: response.data.message || response.statusText
              });
            }
            this.loading = false;
          });
      }
    },
    refresh() {
      this.$refs.grid.refresh();
    },
    hideRemoveMenuItem(context) {
      if (!context.aasm_state) return true;

      return context.aasm_state.id === "deleted";
    },
    hideRestoreMenuItem(context) {
      if (!context.aasm_state) return true;

      return context.aasm_state.id !== "deleted";
    },
    submitFormDelete() {
      this.$refs.reasonCancellationForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.resource
            .remove(this.reasonCancellation)
            .then(() => {
              this.loading = false;
              this.$refs.grid.refresh();
              this.disaplyReasonDialog = false;
            })
            .catch(response => {
              if (response.status === 422) {
                this.$message.error({
                  dangerouslyUseHTMLString: true,
                  message: response.data.full_messages.join("<br/>"),
                  duration: 6000
                });
              } else {
                this.$message.error({
                  dangerouslyUseHTMLString: true,
                  message: response.data.message || response.statusText
                });
              }
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
