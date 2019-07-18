  <template>
  <div>
    <table class="el-table el-table--info" v-if="model.id > 0">
      <tbody>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Требуется подтверждение регистрации:</td>
          <td class="el-table__cell el-table__cell--field">
            <el-checkbox v-model="model.required_confirmation_enrollment"/>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="el-table__cell el-table__cell--label">Групповой сертификат:</td>
          <td class="el-table__cell el-table__cell--field">
            <a
              :href="model.certificate.url"
              target="_blank"
              v-if="model.certificate"
            >Скачать сертификат</a>
            <el-alert v-else :closable="false" type="warning" title="Сертифкат не сформирован"/>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="el-card-title">
      <h3>Участники</h3>
      <el-dropdown
        @command="handleItemsBatchCommand"
        split-button
        type="primary"
        @click="handleItemsBatchCommand('add')"
      >
        Добавить
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">Добавить</el-dropdown-item>
          <el-dropdown-item command="addUnknown">Добавить неизвестных участников</el-dropdown-item>
          <el-dropdown-item command="addByEnrollment">Добавить зарегистрированных участников</el-dropdown-item>
          <el-dropdown-item command="createCertificates">Сформировать групповой сертификат</el-dropdown-item>
          <el-dropdown-item
            :disabled="itemsBachActionDisabled"
            command="createInvoice"
          >Выписать счет</el-dropdown-item>
          <el-dropdown-item
            :disabled="itemsBachActionDisabled"
            command="createCertificate"
          >Выдать сертификаты</el-dropdown-item>
          <el-dropdown-item divided></el-dropdown-item>
          <el-dropdown-item :disabled="itemsBachActionDisabled" command="remove">Удалить</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="model.cost_price_participants_attributes"
      @selection-change="handleItemsSelectionChange"
      :row-class-name="tableItemsRowClass"
      :summary-method="getItemsSummaries"
      show-summary
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="participant_id" label="Участник">
        <template slot-scope="scope">
          <relation-select-input
            v-model="scope.row.participant_id"
            resource="participants{/id}{/action_name}"
            grid="participant-grid"
            form="participant-form"
            :init-model="scope.row.participant"
            value-label="name"
            create-label="Создать участника"
            title-label="Новый участник"
            :createable="true"
          />
          <br v-if="scope.row.certificate_id || scope.row.invoice_id">
          <relation-select-input
            v-if="scope.row.certificate_id"
            v-model="scope.row.certificate_id"
            :init-model="scope.row.certificate"
            resource="certificates{/id}{/action_name}"
            grid="certificate-grid"
            form="certificate-form"
            :readonly="true"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="is_payer"
        label="Плательщик"
        width="150"
        v-if="openCostPriceCodes.includes(model.code)"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.is_payer" title="Плательщик">Плательщик</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="is_free" label="Без оплаты" width="150" v-if="model.code == 'CC'">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.is_free" title="Без оплаты">Без оплаты</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="account_id" label="Аккаунт">
        <template slot-scope="scope">
          <relation-select-input
            v-if="scope.row.is_payer"
            v-model="scope.row.participant_id"
            resource="participants{/id}{/action_name}"
            grid="participant-grid"
            form="participant-form"
            :init-model="scope.row.participant"
            :readonly="true"
          />
          <relation-select-input
            v-else
            v-model="scope.row.account_id"
            resource="accounts{/id}{/action_name}"
            grid="account-grid"
            form="account-form"
            :init-model="scope.row.account"
            value-label="name"
          />
        </template>
      </el-table-column>
      <el-table-column prop="customer_id" label="Плательщик">
        <template slot-scope="scope">
          <relation-select-input
            v-if="scope.row.is_payer"
            v-model="scope.row.participant_id"
            resource="participants{/id}{/action_name}"
            grid="participant-grid"
            form="participant-form"
            :init-model="scope.row.participant"
            :readonly="true"
          />
          <relation-select-input
            v-else
            v-model="scope.row.customer_id"
            :resource="customerResource(scope.row)"
            grid="customer-grid"
            form="customer-form"
            value-label="name"
            :createable="true"
            create-label="Создать плательщика"
            title-label="Новый плательщик"
          />
        </template>
      </el-table-column>
      <el-table-column prop="manager_id" label="Менеджер">
        <template slot-scope="scope">
          <relation-select-input
            v-model="scope.row.manager_id"
            resource="managers{/id}{/action_name}"
            grid="manager-grid"
            form="manager-form"
            :init-model="scope.row.manager"
            value-label="name"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="Цена, RUB"
        width="100"
        :formatter="$formatter.formatColumnCurrency"
        v-if="model.code == 'CC'"
      />
      <el-table-column
        prop="price"
        label="Цена, RUB"
        width="100"
        v-if="openCostPriceCodes.includes(model.code)"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.price"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="discount"
        label="Скидка, %"
        width="100"
        v-if="openCostPriceCodes.includes(model.code)"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.discount"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="sum"
        label="Сумма, RUB"
        width="100"
        :formatter="$formatter.formatColumnCurrency"
      />
      <el-table-column prop="participant_present_id" label="Статус" width="100">
        <template slot-scope="scope">
          <enumeration v-model="scope.row.participant_present_id" code="participant_present"/>
        </template>
      </el-table-column>
      <el-table-column prop="invoice_id" label="Счет" width="200">
        <template slot-scope="scope">
          <relation-select-input
            v-model="scope.row.invoice_id"
            :init-model="scope.row.invoice"
            :resource="buildInvoiceResource(scope.row)"
            grid="invoice-grid"
            form="invoice-form"
          />
        </template>
      </el-table-column>
    </el-table>

    <div v-if="leads.length > 0">
      <div class="el-card-title">
        <h3>Не подтвержденные заявки на регистрацию</h3>
      </div>
      <el-table :data="leads" v-loading="loading">
        <el-table-column sortable prop="aasm_state" label="Статус" width="130">
          <template slot-scope="scope">
            <status-badge :state="scope.row.aasm_state.id" states="lead"/>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="№" width="100">
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.id"
              :to="{ name: `editLead`, params: { id: scope.row.id}}"
            >{{scope.row.id}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="participant_id" label="Участник">
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.participant.id"
              :to="{ name: `editParticipant`, params: { id: scope.row.participant.id}}"
            >{{scope.row.participant.value}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="Действие" width="300">
          <template slot-scope="scope">
            <el-button type="success" @click="confirm(scope.row)">Подтвердить</el-button>
            <el-button type="danger" @click="decline(scope.row)">Отклонить</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <search-dialog
      :resource="contractResource"
      grid="contract-grid"
      form="contract-form"
      ref="searchContractDialog"
      title="Выбрать договор"
      create-btn-label="Создать договор"
      :createable="true"
      :params="contractParams"
      :continueable="true"
      @continue="handleContractSelect"
      @select="handleContractSelect"
    />

    <search-dialog
      resource="participants{/id}{/action_name}"
      grid="participant-grid"
      form="participant-form"
      ref="searchParticipantDialog"
      create-btn-label="Создать участника"
      :createable="true"
      :multiselect="true"
      @select="handleParticipantSelect"
    />

    <el-dialog
      title="Добавить неизвестных участников"
      :visible.sync="displayAddUnknownDialog"
      width="30%"
    >
      <span>Укажите количество участников</span>
      <el-input v-model="numberUnknown"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="displayAddUnknownDialog = false">Отмена</el-button>
        <el-button type="primary" @click="addUnknownParticipants">Добавить</el-button>
      </span>
    </el-dialog>

    <search-dialog
      :resource="leadsResource"
      grid="lead-grid"
      form="lead-form"
      ref="searchLeadDialog"
      :createable="false"
      :multiselect="true"
      @select="handleLeadSelect"
    />
  </div>
</template>

<style>
.el-table .hidden {
  display: none;
}
</style>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CostPriceParticipantsTab",
  props: {
    model: {
      required: true,
      type: Object
    },
    leads: {
      required: true,
      type: Array
    },
    loading: false
  },
  data() {
    return {
      multipleItemsSelection: [],
      numberUnknown: 1,
      displayAddUnknownDialog: false
    };
  },
  computed: {
    itemsBachActionDisabled() {
      return this.multipleItemsSelection.length == 0;
    },
    selectedAccounts() {
      return this.multipleItemsSelection
        .map(item => item.account_id)
        .filter((v, i, a) => a.indexOf(v) === i);
    },
    selectedCustomers() {
      return this.multipleItemsSelection
        .map(item => item.customer_id)
        .filter((v, i, a) => a.indexOf(v) === i);
    },
    selectedParticipants() {
      return this.multipleItemsSelection
        .filter(item => item.is_payer)
        .map(item => item.participant_id)
        .filter((v, i, a) => a.indexOf(v) === i);
    },
    contractResource() {
      return `contracts{/id}{/action_name}?scope[customer_id]=${
        this.selectedCustomers[0]
      }`;
    },
    leadsResource() {
      return `leads{/id}{/action_name}?scope[cost_price_id]=${this.model.id}`;
    },
    contractParams() {
      return {
        account_id: this.selectedAccounts[0],
        customer_id: this.selectedCustomers[0],
        type: "Contract::LegalPerson"
      };
    },
    openCostPriceCodes() {
      return ["OE", "EV"];
    }
  },
  watch: {
    model: {
      handler: "calculate",
      deep: true
    }
  },
  methods: {
    handleItemsSelectionChange(val) {
      this.multipleItemsSelection = val;
    },
    handleItemsBatchCommand(command) {
      if (command === "add") {
        this.$refs.searchParticipantDialog.open();
      } else if (command === "addUnknown") {
        this.displayAddUnknownDialog = true;
      } else if (command === "create") {
        this.$refs.createParticipantDialog.open();
      } else if (command === "addByEnrollment") {
        this.$refs.searchLeadDialog.open();
      } else if (command === "remove") {
        this.multipleItemsSelection.forEach(item => (item._destroy = true));
        this.multipleItemsSelection = [];
      } else if (command === "createInvoice") {
        if (
          this.selectedParticipants.length > 1 ||
          this.selectedCustomers.length > 1
        ) {
          this.$message.error("Выбраны позиции с разными плательщиками!");
        } else if (
          this.selectedParticipants[0] == null &&
          this.selectedCustomers[0] == null
        ) {
          this.$message.error("У выбраных позиции не указан плательщик!");
        } else if (this.selectedAccounts.length > 1) {
          this.$message.error("Выбраны позиции с разными аккаунтами!");
        } else {
          var scope = {};
          if (this.selectedParticipants.length > 0) {
            scope.participant_id = this.selectedParticipants[0];
          } else {
            scope.customer_id = this.selectedCustomers[0];
          }

          this.$resource("contracts")
            .get({ scope: scope })
            .then(response => {
              let contracts = response.data.items;
              if (contracts.length > 1) {
                this.$refs.searchContractDialog.open();
              } else {
                this.createNewInvoice(contracts[0] ? contracts[0].id : null);
              }
            });
        }
      }
      if (command === "createCertificate") {
        this.$resource("cost_prices{/cost_price_id}/certificates", {
          cost_price_id: this.model.id
        })
          .save({
            participant_ids: this.multipleItemsSelection.map(
              item => item.participant_id
            )
          })
          .then(response => {
            this.$message.info("Задание на генерацию сертифкатов выполнено.");
          });
      }
      if (command === "createCertificates") {
        this.$resource("cost_prices{/cost_price_id}/certificates", {
          cost_price_id: this.model.id
        })
          .save({})
          .then(response => {
            this.$message.info(
              "Задание на генерацию сертифкатов поставлено в очередь. По окончании вывполения задания Вам придет уведомление."
            );
          });
      }
    },
    tableItemsRowClass({ row, rowIndex }) {
      if (row._destroy) return "hidden";
    },
    handleCreateParticpants(ids) {
      let max = Math.max(
        0,
        ...this.model.cost_price_participants_attributes.map(
          item => item.number
        )
      );
      let newParticipants = ids.map((id, index) => {
        return {
          participant_id: id,
          number: max + index + 1
        };
      });
      Object.assign(this.model, {
        cost_price_participants_attributes: [
          ...this.model.cost_price_participants_attributes,
          ...newParticipants
        ]
      });
    },
    calculate(model) {
      const duration = this.calculateDuration(model);
      const activeParticipants = model.cost_price_participants_attributes.filter(
        part => !part._destroy
      );
      if (this.openCostPriceCodes.includes(model.code)) {
        activeParticipants.forEach(part => {
          const price = this.parseNumber(part.price);
          const discount = this.parseNumber(part.discount);
          const sum = price * duration * (1 - discount / 100);

          Object.assign(part, { sum: sum });
        });
      } else if (activeParticipants.length > 0) {
        const constContractSum = this.calculateContractPrice(model);

        activeParticipants.forEach(part => {
          const sum = constContractSum / activeParticipants.length;
          const price = sum / duration;

          Object.assign(part, { price: price, sum: sum });
        });
      }
    },
    calculateDuration(model) {
      return model.cost_price_periods_attributes
        .filter(period => !period._destroy)
        .map(period => this.parseNumber(period.duration))
        .reduce((a, b) => {
          return a + b;
        }, 0);
    },
    calculateContractPrice(model) {
      return model.cost_price_services_attributes
        .filter(service => !service._destroy)
        .map(service => this.parseNumber(service.sum))
        .reduce((a, b) => {
          return a + b;
        }, 0);
    },
    getItemsSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        var indexes = this.openCostPriceCodes.includes(this.model.code)
          ? [5, 6, 8]
          : [5, 6, 7];
        if (!indexes.includes(index)) return;
        if (index === 5) {
          sums[index] = "Итого:";
          return;
        }
        const values = data
          .filter(item => !item._destroy)
          .map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);

          sums[index] = this.$formatter.formatCurrency(sums[index]);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    customerResource(context) {
      return context.account_id
        ? `customers{/id}{/action_name}?scope[account_id]=${context.account_id}`
        : "customers{/id}{/action_name}";
    },
    handleContractSelect(contractIds) {
      if (contractIds) {
        this.createNewInvoice(contractIds[0]);
      } else {
        this.createNewInvoice(null);
      }
    },
    handleParticipantSelect(participantIds) {
      this.handleCreateParticpants(participantIds);
    },
    handleLeadSelect(leadIds, leads) {
      this.handleCreateParticpants(leads.map(lead => lead.participant.id));
    },
    createNewInvoice(contractId) {
      let routeData = this.$router.resolve({
        name: "newInvoice",
        query: {
          contract_id: contractId,
          cost_price_id: this.model.id,
          cost_price_participant_ids: this.multipleItemsSelection.map(
            item => item.id
          ),
          redirect: this.$route.fullPath
        }
      });

      window.open(routeData.href, "_blank");
    },
    addUnknownParticipants() {
      let number = Number(this.numberUnknown);
      let ids = Array.apply(null, Array(number)).map(() => 1);
      this.handleCreateParticpants(ids);
      this.displayAddUnknownDialog = false;
    },
    confirm(context) {
      this.loading = true;
      this.$resource("leads{/id}")
        .update({ id: context.id }, { method: "confirm" })
        .then(() => {
          this.loading = false;
          this.$emit("refresh");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    decline(context) {
      this.loading = true;
      this.$resource("leads{/id}")
        .update({ id: context.id }, { method: "decline" })
        .then(() => {
          this.loading = false;
          this.$emit("refresh");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    parseNumber(value) {
      const result = Number(value);

      return Number.isNaN(result) ? 0 : result;
    },
    buildInvoiceResource(costPriceParticipant) {
      if (costPriceParticipant.is_payer) {
        return `invoices{/id}{/action_name}?scope[cost_price_id]=&scope[customerable_id]=${
          costPriceParticipant.participant_id
        }&customerable_type=Participant`;
      } else {
        return `invoices{/id}{/action_name}?scope[cost_price_id]=&scope[customerable_id]=${
          costPriceParticipant.customer_id
        }&customerable_type=Customer`;
      }
    }
  }
};
</script>
