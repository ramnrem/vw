<template>
  <el-tabs v-model="activeName" @tab-click="handleChangeTab">
    <el-tab-pane label="Основное" name="first">
      <el-form-item label="Название" prop="name" :rules="rules.required">
        <el-input v-model="model.name"/>
      </el-form-item>
      <template v-if="model.full_access">
        У роли
        <i>{{model.name}}</i>:
        <b>полный доступ</b>
      </template>
    </el-tab-pane>
    <el-tab-pane label="Документы" name="documents" v-if="!model.full_access">
      <el-table v-loading="loading" :data="documents">
        <el-table-column prop="id" label="Ид" sortable width="100"/>
        <el-table-column prop="document" label="Документ" sortable/>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">
              <font-awesome-icon icon="pencil-alt"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="Права доступа" :visible.sync="dialogVisible" width="90%">
        <el-row v-loading="dialogLoading">
          <el-form v-model="currentDocument" ref="documentForm">
            <h4>Разерешения</h4>
            <el-table :data="currentDocument.role_document_permissions_attributes">
              <el-table-column prop="state" label="Статус" width="200">
                <template
                  slot-scope="scope"
                >{{currentDocument.states.find(s => s.id == scope.row.state).value}}</template>
              </el-table-column>
              <el-table-column prop="actions" label="Действия">
                <template slot-scope="scope">
                  <el-checkbox-group v-model="scope.row.actions">
                    <el-checkbox
                      v-for="action in currentDocument.actions"
                      :label="action.id"
                      :key="action.id"
                    >{{action.value}}</el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-table-column>
            </el-table>

            <h4>Правила</h4>
            <el-alert type="warning" title="Внимание!" description="По умолчанию все разрешено."></el-alert>
            <br>
            <el-button @click="addDocumentTransition" type="primary">Добавить правило</el-button>
            <br>
            <el-form
              v-model="currentDocument.role_document_transitions_attributes"
              ref="formTransitions"
            >
              <el-table
                :data="currentDocument.role_document_transitions_attributes"                
              >
                <el-table-column prop="number" label="№" width="100">
                  <template slot-scope="scope">
                    <el-form-item prop="number">
                      <el-input v-model="scope.row.number"/>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="from" label="Начальный статус" width="200">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-select v-model="scope.row.from" clearable placeholder="Любой статус">
                        <el-option
                          v-for="state in currentDocument.states"
                          :label="state.value"
                          :value="state.id"
                          :key="state.id"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="to" label="Конечный статус" clearable width="200">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-select v-model="scope.row.to" placeholder="Любой статус">
                        <el-option
                          v-for="state in currentDocument.states"
                          :label="state.value"
                          :value="state.id"
                          :key="state.id"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="allow" width="300">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-switch
                        active-text="Разрешено"
                        active-color="green"
                        inactive-text="Запрещено"
                        inactive-color="red"
                        v-model="scope.row.allow"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="condition" label="Условие">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.condition" placeholder="Пример: record.deleted?"/>
                      <el-input v-model="scope.row.message" placeholder="Сообщение об ошибке"/>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column width="100" label="Удалить">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-checkbox v-model="scope.row._destroy"/>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Отмена</el-button>
          <el-button type="primary" @click="saveDocument">Сохранить</el-button>
        </span>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
const TAB_FIRST = "first";
const TAB_DOCUMENTS = "documents";
const DOCUMENT_RESOURCE = "roles{/role_id}/documents{/id}{/action_name}";

export default {
  name: "RoleForm",
  props: {
    model: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      activeName: TAB_FIRST,
      loading: false,
      documents: [],
      currentDocument: {},
      dialogVisible: false,
      dialogLoading: false,
      rules: {
        required: {
          required: true,
          message: "не может быть пустым"
        }
      }
    };
  },
  methods: {
    handleChangeTab(tab) {
      if (tab.name == TAB_DOCUMENTS) {
        this.selectDocuments();
      }
    },
    selectDocuments() {
      this.loading = true;
      this.$resource(DOCUMENT_RESOURCE)
        .get({ role_id: this.model.id })
        .then(response => {
          this.documents = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;

          return error;
        });
    },
    saveDocument() {
      this.dialogLoading = true;
      this.$resource(DOCUMENT_RESOURCE)
        .update(
          { role_id: this.model.id, id: this.currentDocument.id },
          this.currentDocument
        )
        .then(response => {
          this.currentDocument = Object.assign({}, response.data);
          this.dialogLoading = false;
          this.dialogVisible = false;
        })
        .catch(error => {
          this.dialogLoading = false;
          this.dialogVisible = false;

          return error;
        });
    },
    handleEdit(document) {
      this.dialogVisible = true;
      this.dialogLoading = true;

      this.$resource(DOCUMENT_RESOURCE)
        .get({ role_id: this.model.id, id: document.id })
        .then(response => {
          this.currentDocument = Object.assign({}, response.data);
          this.dialogLoading = false;
        })
        .catch(error => {
          this.dialogLoading = false;
          this.dialogVisible = false;

          return error;
        });
    },    
    addDocumentTransition() {
      var max = Math.max(0, ...this.currentDocument.role_document_transitions_attributes.map(item => item.number))
      
      this.currentDocument.role_document_transitions_attributes.push({
        number: (max || 0) + 1,
        to: "",
        from: "",
        allow: false,
        _destroy: false
      });
    }
  }
};
</script>
