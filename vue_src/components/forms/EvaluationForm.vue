<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="Результаты опроса">
        <el-row type="flex" :gutter="18">
          <el-col>
            <el-form-item label="Калькуляция" prop="cost_price_id">
              <relation-select-input
                v-model="model.cost_price_id"
                resource="cost_prices{/id}{/action_name}"
                grid="cost-price-grid"
                form="cost-price-form"
                @change="handleCommand('addParticipants')"
                :readonly="model.id > 0"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-button
              v-if="!model.id"
              type="primary"
              @click="handleCommand('addDefaultQuestions')"
            >Добавить вопросы по умолчанию</el-button>
          </el-col>
        </el-row>
        <el-form-item label="Замечания о курсе" prop="course_note">
          <el-input type="textarea" v-model="model.course_note"/>
        </el-form-item>
        <el-form-item label="Замечания о тренере" prop="trainer_note">
          <el-input type="textarea" v-model="model.trainer_note"/>
        </el-form-item>
        <el-form-item label="Замечания об учебном материале" prop="material_note">
          <el-input type="textarea" v-model="model.material_note"/>
        </el-form-item>
        <el-form-item label="Рекомендации коллегам" prop="recommendation">
          <el-input type="textarea" v-model="model.recommendation"/>
        </el-form-item>
        <el-form-item label="Пожелания" prop="suggestion">
          <el-input type="textarea" v-model="model.suggestion"/>
        </el-form-item>
        <el-form-item label="Общие впечатления" prop="impression">
          <el-input type="textarea" v-model="model.impression"/>
        </el-form-item>
        <el-form-item label="Какие еще курсы хотели бы посетить" prop="course_recommendation">
          <el-input type="textarea" v-model="model.course_recommendation"/>
        </el-form-item>
        <el-form-item label="Средняя оценка" prop="avg">
          <b>{{model.avg}}</b>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane name="participants" label="Участники">
        <div class="el-spacer"></div>
        <search-dialog
          :resource="participantResource"
          grid="participant-grid"
          form="participant-form"
          ref="searchParticipantDialog"
          @select="handleParticipantSelect"
          :multiselect="true"
        />
        <grid-input
          :data="model.participants_attributes"
          :commands="participantsCommands"
          :command-handler="participantsCommandHandler"
        >
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
                create-title="Новый участник"
              />
            </template>
          </el-table-column>
        </grid-input>
      </el-tab-pane>
      <el-tab-pane
        v-for="section in model.sections_attributes"
        :key="section.code"
        :name="section.name"
        :label="section.name"
      >
        <el-button type="primary" @click="handleCommand('addQuestions')">Добавить вопросы</el-button>
        <el-table
          :data="buildSectionGridData(section)"
          header-cell-class-name="evaluation-cell"
          :row-class-name="tableItemsRowClass"
          :summary-method="getItemsSummaries"
          show-summary
        >
          <el-table-column prop="question.question" label="Вопрос" min-width="200" fixed/>
          <el-table-column
            v-for="column in buildSectionGridHeader(section)"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            width="120"
            :filters="[{ text: 'Удалить?', value: column.prop }]"
            :filter-method="removeParticipant"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row[scope.column.property].value"
                :class="{'el-input--gray': scope.row.question.not_calc}"
              />
            </template>
          </el-table-column>
          <el-table-column prop="avg" label width="50">
            <template slot-scope="scope">{{scope.row[scope.column.property].value}}</template>
          </el-table-column>
          <el-table-column prop="action" label width="70">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete el-icon__center"
                @click="removeQuestion(scope.row.action)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <search-dialog
      :resource="resource"
      form="contract-form"
      ref="searchQuestionsDialog"
      @select="handleQuestionsSelect"
      :multiselect="true"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "EvaluationForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      activeName: "first"
    };
  },
  created() {
    this.retrieveTab();
  },
  watch: {
    activeName: "storeTab"
  },
  computed: {
    idForm() {
      return `${this.$options.name}|${this.$route.path}|${this.$parent.name}`;
    },
    contextMenu() {
      return [
        {
          label: "Выбрать",
          command: this.selectQuestionnaires,
          primary: true
        }
      ];
    },
    resource() {
      return this.$resource("questionnaires{/id}");
    },
    ...mapGetters({
      questionnaire_areas: "constants/questionnaire_areas"
    }),
    participantResource() {
      return this.$resource("participants{/id}{/action_name}", {
        scope: { cost_price_id: this.model.cost_price_id }
      });
    },
    participantsCommands() {
      return [
        {
          label: "Добавить участника",
          command: "add",
          disabled: false
        },
        {
          divided: true
        },
        {
          label: "Удалить",
          command: "remove",
          disabled: this.isCommandDisabled
        }
      ];
    }
  },
  methods: {
    storeTab(tab) {
      localStorage.setItem(this.idForm, tab);
    },
    retrieveTab() {
      this.activeName = localStorage.getItem(this.idForm) || "first";
    },
    handleCommand(command) {
      if (command === "addQuestions") {
        this.$refs.searchQuestionsDialog.open();
      }
      if (command === "addDefaultQuestions") {
        this.$resource("evaluations/calculate", {
          id: this.model.id,
          default_questions: true
        })
          .save(this.model)
          .then(response => {
            Object.assign(this.model, response.data);

            this.$message.info("Вопросы добавлены");
          });
      }
      if (command === "addParticipants") {
        this.$resource("evaluations/calculate", {
          id: this.model.id
        })
          .save(this.model)
          .then(response => {
            Object.assign(this.model, response.data);

            this.$message.info("Участники курса добавлены");
          });
      }
    },
    handleQuestionsSelect(ids) {
      ids.forEach(id => this.selectQuestionnaires(id));
    },
    selectQuestionnaires(id) {
      let section = this.model.sections_attributes.find(
        section => section.name === this.activeName
      );
      let questions = section.questions_attributes;
      let start_number = Math.max(...questions.map(q => q.number)) + 1;
      this.resource.get({ id: id }).then(response => {
        let answers = [];
        response.data.items_attributes.map(question => {
          let answers = this.model.participants_attributes.map(
            (participant, index) => {
              return {
                participant: participant.participant,
                participant_id: participant.participant.id,
                number: index,
                value: null,
                _destroy: false
              };
            }
          );

          section.questions_attributes.push({
            question: question.question,
            number: start_number + question.number,
            not_calc: question.not_calc,
            answers_attributes: answers,
            _destroy: false
          });
        });
        this.dialogVisible = false;
      });
    },
    buildSectionGridData(section) {
      return section.questions_attributes.map(question => {
        let row = {
          question: question
        };
        let values = [];

        question.answers_attributes
          .filter(answer => !answer._destroy)
          .forEach(answer => {
            row[`prop_${answer.number}`] = answer;
            values.push(Number(answer.value));
          });

        row.avg = {
          value: question.not_calc ? '' : this.calculateAvg(values),
          _destroy: false
        };

        row.action = question;

        return row;
      });
    },
    buildSectionGridHeader(section) {
      if (section.questions_attributes.length === 0) return [];

      let answers = section.questions_attributes[0].answers_attributes;

      return answers
        .filter(answer => !answer._destroy)
        .map(answer => {
          return {
            label: answer.participant.name,
            prop: `prop_${answer.number}`
          };
        });
    },
    calculateAvg(values) {
      values = values.map(v => Number(v)).filter(v => v > 0);

      return values.length > 0
        ? (values.reduce((a, b) => a + b) / values.length).toFixed(1)
        : null;
    },
    getItemsSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index < 1) {
          return;
        }
        
        const values = data
          .filter(item => !item._destroy && !item.question.not_calc)
          .map(item => Number(item[column.property].value));
        if (!values.every(value => isNaN(value))) {
          sums[index] = this.calculateAvg(values);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    removeQuestion(question) {
      question._destroy = true;
    },
    tableItemsRowClass({ row, rowIndex }) {
      if (row.question._destroy) return "hidden";
    },
    removeParticipant(value, row) {
      if (row[value]) {
        row[value]._destroy = true;
      }
      return true;
    },
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    participantsCommandHandler(context, command) {
      if (command === "add") {
        this.$refs.searchParticipantDialog.open();
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    handleParticipantSelect(participantIds) {
      participantIds.forEach(participantId => {
        this.$resource("participants{/id}")
          .get({ id: participantId })
          .then(response => {
            let participant = response.data;

            this.model.participants_attributes.push({
              participant_id: participant.id,
              participant: participant,
              _destroy: false
            });
          });
      });
    }
  }
};
</script>
