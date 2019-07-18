<template>
  <div>
    <el-row type="flex" :gutter="18">
      <el-col>
        <el-form-item label="Название" prop="name" :rules="rules.required">
          <el-input v-model="model.name"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Использовать внешний шаблон" prop="use_template">
          <el-switch v-model="model.use_template" active-text="Да"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Параметры" name="params">
        <grid-input
          :data="model.report_parameters_attributes"
          :commands="commandsGrid"
          :command-handler="handlerGridParams"
        >
          <el-table-column prop="number" label="Позиция" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.number"/>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Имя" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name"/>
            </template>
          </el-table-column>
          <el-table-column prop="label" label="Заголовок">
            <template slot-scope="scope">
              <el-input v-model="scope.row.label"/>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="Тип" width="400">
            <template slot-scope="scope">
              <el-row type="flex" :gutter="18">
                <el-col>
                  <el-select v-model="scope.row.data_type">
                    <el-option
                      v-for="(label, key) in dataTypes"
                      :key="key"
                      :label="label"
                      :value="key"
                    />
                  </el-select>
                </el-col>
                <el-col>
                  <el-select v-model="scope.row.entity" v-if="scope.row.data_type === 'entity'">
                    <el-option
                      v-for="entity in entities"
                      :key="entity.name"
                      :label="$t(`resource.${entity.slug}.name`)"
                      :value="entity.name"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="required" label="Обязательный" width="200">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.required" active-text="Да"/>
            </template>
          </el-table-column>
        </grid-input>
      </el-tab-pane>
      <el-tab-pane label="Колонки" name="columns">
        <grid-input
          :data="model.report_columns_attributes"
          :commands="commandsGrid"
          :command-handler="handlerGridColumns"
        >
          <el-table-column prop="number" label="Позиция" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.number"/>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Имя" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name"/>
            </template>
          </el-table-column>
          <el-table-column prop="label" label="Заголовок">
            <template slot-scope="scope">
              <el-input v-model="scope.row.label"/>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="Тип" width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.data_type">
                <el-option
                  v-for="(label, key) in dataTypes"
                  :key="key"
                  :label="label"
                  :value="key"
                />
              </el-select>
              <el-input
                type="textarea"
                v-model="scope.row.formatter"
                autocomplete="off"
                v-if="scope.row.data_type === 'custom'"
              />
            </template>
          </el-table-column>
          <el-table-column prop="width" label="Ширина" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.width"/>
            </template>
          </el-table-column>
          <el-table-column prop="format" label="Формат" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.format"/>
            </template>
          </el-table-column>
          <el-table-column prop="summary" label="Подсчитывать итоги" width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.summary" clearable>
                <el-option
                  v-for="(label, key) in {sum: 'Сумма', count: 'Кол-во', avg: 'Среднее', min: 'Минимум', max: 'Максимум'}"
                  :key="key"
                  :label="label"
                  :value="key"
                />
              </el-select>
            </template>
          </el-table-column>
        </grid-input>
      </el-tab-pane>
       <el-tab-pane label="Форматирование" name="styles">
        <grid-input
          :data="model.report_row_styles_attributes"
          :commands="commandsGrid"
          :command-handler="handlerGridRowStyles"
        >
          <el-table-column prop="number" label="Позиция" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.number"/>
            </template>
          </el-table-column>
          <el-table-column prop="bg_color" label="Цвет фона" width="150">
            <template slot-scope="scope">
              <el-color-picker v-model="scope.row.bg_color"/>
            </template>
          </el-table-column>
           <el-table-column prop="fg_color" label="Цвет текста" width="150">
            <template slot-scope="scope">
              <el-color-picker v-model="scope.row.fg_color"/>
            </template>
          </el-table-column>
          <el-table-column prop="condition" label="Условие">
            <template slot-scope="scope">
              <el-input type="textarea" v-model="scope.row.condition"/>
            </template>
          </el-table-column>
        </grid-input>
      </el-tab-pane>
      <el-tab-pane label="Источник данных" name="query">
        <el-form-item label="Запрос SQL" prop="query">
          <el-input type="textarea" autosize v-model="model.query"/>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="Шаблон" name="template" v-if="model.use_template">
        <el-form-item label="Шаблон" prop="template_key">
          <template v-if="model.template_key">
            <a :href="model.template_url">{{model.template_filename}}</a>
          </template>
        </el-form-item>
        <el-upload
          :file-list="fileList"
          :action="action"
          :headers="headers"
          :on-error="uploadError"
          :on-success="uploadSuccess"
        >
          <el-button size="small" type="primary" icon="el-icon-upload">Загрузить шаблон</el-button>
          <div class="el-upload__tip" slot="tip">Разрешенный формат шаблонов: xlsx</div>
        </el-upload>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ReportForm",
  props: {
    model: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      rules: {
        required: {
          required: true,
          message: "не может быть пустым"
        }
      },
      activeName: "params",
      fileList: [],
      entities: [],
      dialogFormatterFormVisible: false
    };
  },
  computed: {
    ...mapGetters({
      token: "auth/accessToken"
    }),
    headers() {
      return {
        Authorization: `Bearer ${this.token}`
      };
    },
    action() {
      return `${
        this.$http.options.root
      }/api/v1/files?category=report_templates`;
    },
    dataTypes() {
      return {
        string: "Строка",
        integer: "Целое число",
        decimal: "Число с пл. точкой",
        boolean: "Истина/Ложь",
        date: "Дата",
        datetime: "Время",
        entity: "Сущность",
        custom: "Пользовательский"
      };
    },
    commandsGrid() {
      return [
        { label: "Добавить", command: "add" },
        { divided: true },
        {
          label: "Удалить",
          command: "remove",
          disabled: this.isCommandDisabled
        }
      ];
    }
  },
  mounted() {
    this.$resource("api/v1/entities")
      .get()
      .then(response => {
        this.entities = response.data;
      });
  },
  methods: {
    uploadError(err, file, fileList) {
      this.$message.error({
        dangerouslyUseHTMLString: true,
        message: JSON.parse(err.message).errors.template.join(", ")
      });
      this.fileList = [];
    },
    uploadSuccess(response, file, fileList) {
      this.model.template_key = response.key;
      this.model.template_filename = response.filename;
      this.model.template_url = response.url;
      this.fileList = [];
    },
    isCommandDisabled(context, command) {
      return !context.hasSelectedItems;
    },
    handlerGridParams(context, command) {
      if (command === "add") {
        let max = Math.max(
          0,
          ...this.model.report_parameters_attributes.map(i => i.number)
        );

        this.model.report_parameters_attributes.push({
          number: max + 1,
          required: true,
          _destroy: false
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
    handlerGridColumns(context, command) {
      if (command === "add") {
        const max = Math.max(0, ...this.model.report_columns_attributes.map(item => item.number))
        this.model.report_columns_attributes.push({
          number: max + 1,
          required: true,
          _destroy: false
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    },
     handlerGridRowStyles(context, command) {
      if (command === "add") {
        const max = Math.max(0, ...this.model.report_row_styles_attributes.map(item => item.number))
        this.model.report_row_styles_attributes.push({
          number: max + 1,
          _destroy: false
        });
      }
      if (command === "remove") {
        context.selectedItems.forEach(item => (item._destroy = true));

        context.selectedItems = [];
      }
    }
  }
};
</script>
