<template>
  <div class="container">
    <div class="default-navbar">
      <div class="default-navbar__item">
        <div class="default-navbar-web">
          <el-menu
            mode="horizontal"
            class="el-menu--bx"
            :router="true"
            :default-active="$route.path"
          >
            <template v-for="(item, index) in menu">
              <el-submenu
                :index="index.toString()"
                class="el-submenu--bx"
                :key="index"
                v-if="item.children"
              >
                <template slot="title">{{item.label}}</template>
                <el-menu-item
                  v-for="subItem in item.children"
                  :index="subItem.index"
                  class="el-menu-item--sub-bx"
                  :route="subItem.route"
                  :key="subItem.index"
                >{{subItem.label}}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="index.toString()"
                :key="index"
                class="el-submenu--bx"
                :route="item.route"
              >{{item.label}}</el-menu-item>
            </template>
          </el-menu>
        </div>
        <div class="default-navbar-mobile">
          <el-menu
            mode="horizontal"
            class="el-menu--bx"
            :router="true"
            :default-active="$route.path"
          >
            <el-submenu index="root" class="default-navbar-mobile-bar">
              <template slot="title">
                <font-awesome-icon icon="bars" class="default-navbar-mobile-bar-icon" />
              </template>
              <template v-for="(item, index) in menu">
                <el-submenu
                  :index="index.toString()"
                  class="el-submenu--bx"
                  :key="index"
                  v-if="item.children"
                >
                  <template slot="title">{{item.label}}</template>
                  <el-menu-item
                    v-for="subItem in item.children"
                    :index="subItem.index"
                    class="el-menu-item--sub-bx"
                    :route="subItem.route"
                    :key="subItem.index"
                  >{{subItem.label}}</el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="index.toString()"
                  :key="index"
                  class="el-submenu--bx"
                  :route="item.route"
                >{{item.label}}</el-menu-item>
              </template>
            </el-submenu>
          </el-menu>
        </div>
      </div>
      <div class="default-navbar__item" v-if="!hideSignIn">
        <el-button type="text" class="default-navbar-sign-out" @click="signOut">
          <font-awesome-icon icon="sign-out-alt" />
        </el-button>
      </div>
    </div>
    <div class="main">
      <Content />
    </div>
  </div>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      menu: [
        {
          label: "CRM",
          children: [
            {
              index: "/leads",
              route: { name: "indexLead" },
              label: "Лиды"
            },
            {
              index: "/accounts",
              route: { name: "indexAccount" },
              label: "Аккаунты"
            },
            {
              index: "/customers",
              route: { name: "indexCustomer" },
              label: "Плательщики"
            },
            {
              index: "/contacts",
              route: { name: "indexContact" },
              label: "Контакты"
            },
            {
              index: "/activities",
              route: { name: "indexActivity" },
              label: "Мои дела"
            }
          ]
        },
        {
          label: "Калькуляции",
          children: [
            {
              index: "/cost_prices",
              route: { name: "indexCostPrice" },
              label: "Кост-прайсы"
            },
            {
              index: "/logistic_requests",
              route: { name: "indexLogisticRequest" },
              label: "Логистические заявки"
            },
            {
              index: "/trainer_orders",
              route: { name: "indexTrainerOrder" },
              label: "Заказ-счета на тренера"
            },
            {
              index: "/room_reservations",
              route: { name: "indexRoomReservation" },
              label: "Резервирование аудиторий"
            }
          ]
        },
        {
          label: "Участники",
          children: [
            {
              index: "/participants",
              route: { name: "indexParticipant" },
              label: "Участники"
            },
            {
              index: "/certificates",
              route: { name: "indexCertificate" },
              label: "Сертификаты"
            },
            {
              index: "/evaluations",
              route: { name: "indexEvaluation" },
              label: "Опросы"
            }
          ]
        },
        {
          label: "Бухгалтерия",
          children: [
            {
              index: "/contracts",
              route: { name: "indexContract" },
              label: "Договора"
            },
            {
              index: "/invoices",
              route: { name: "indexInvoice" },
              label: "Счета"
            },
            { index: "/acts", route: { name: "indexAct" }, label: "Акты" },
            {
              index: "/facturas",
              route: { name: "indexFactura" },
              label: "Счета-фактуры"
            }
          ]
        },
        {
          label: "Справочники",
          children: [
            {
              index: "/courses",
              route: { name: "indexCourse" },
              label: "Курсы"
            },
            {
              index: "/managers",
              route: { name: "indexManager" },
              label: "Менеджеры"
            },
            {
              index: "/tariffs",
              route: { name: "indexTariff" },
              label: "Тарифы"
            },
            {
              index: "/trainers",
              route: { name: "indexTrainer" },
              label: "Тренеры"
            },
            {
              index: "/holidays",
              route: { name: "indexHoliday" },
              label: "Праздничные дни"
            },
            {
              index: "/rooms",
              route: { name: "indexRoom" },
              label: "Аудитории"
            },
            {
              index: "/services",
              route: { name: "indexService" },
              label: "Услуги"
            },
            {
              index: "/suppliers",
              route: { name: "indexSupplier" },
              label: "Поставщики"
            },
            {
              index: "/resources",
              route: { name: "indexResource" },
              label: "Ресурсы"
            },
            {
              index: "/resource_sets",
              route: { name: "indexResourceSet" },
              label: "Набор ресурсов"
            },
            {
              index: "/questionnaires",
              route: { name: "indexQuestionnaire" },
              label: "Опросники"
            },
            {
              index: "/trainer_services",
              route: { name: "indexTrainerService" },
              label: "Услуги тренера"
            },
            {
              index: "/dictionaries",
              route: { name: "indexDictionary" },
              label: "Справочники"
            },
            {
              index: "/trainer_absences",
              route: { name: "indexTrainerAbsence" },
              label: "График отсутствий тренера"
            },
            {
              index: "/assistants",
              route: { name: "indexAssistant" },
              label: "Ассистенты"
            }
          ]
        },
        { route: { name: "indexReportItem" }, label: "Отчеты" },
        { route: { name: "indexCalendar" }, label: "Расписание" },
        {
          label: "Настройки",
          children: [
            {
              index: "/settings/users",
              route: { name: "indexUser" },
              label: "Пользователи"
            },
            {
              index: "/settings/groups",
              route: { name: "indexGroup" },
              label: "Группы"
            },
            {
              index: "/settings/roles",
              route: { name: "indexRole" },
              label: "Роли"
            },
            {
              index: "/signers",
              route: { name: "indexSigner" },
              label: "Подписанты"
            },
            {
              index: "/own_firms",
              route: { name: "indexOwnFirm" },
              label: "Наши организации"
            },
            {
              index: "/print_forms",
              route: { name: "indexPrintForm" },
              label: "Печатные формы"
            },
            {
              index: "/constants",
              route: { name: "indexConstant" },
              label: "Константы"
            },
            {
              index: "/reports",
              route: { name: "indexReport" },
              label: "Настройка отчетов"
            },
            {
              index: "/settings/currencies",
              route: { name: "indexCurrency" },
              label: "Валюты"
            },
            {
              index: "/settings/jobs",
              route: { name: "indexJob" },
              label: "Задачи"
            }
          ]
        }
      ]
    };
  },
  computed: {
    hideSignIn() {
      return process.env.VUE_APP_MODE === 'bitrix'
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch('auth/signOut').then(_ => {
        this.$router.push({ name: 'signIn'})
      }).catch(_ => {
        this.$router.push({ name: 'signIn'})
      })
    }
  }
};
</script>

<style lang="scss">
.default-navbar {
  height: 100%;
  min-height: 60px;
  max-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-bottom: solid 1px #e6e6e6;
  padding: 0 20px 0 0;

  &-web {
    display: block;
  }

  &-mobile {
    display: none;

    &-bar {
      .el-submenu__title {
        border-bottom: none;

        .el-submenu__icon-arrow {
          display: none;
        }
      }

      &-icon {
        font-size: 26px;
      }
    }
  }

  &-sign-out {
    font-size: 26px;
    color: #909399;

    &:hover {
      color: #545c6a;
    }
  }
}

.el-menu {
  &:after {
    display: none !important;
  }
}

@media (max-width: 1357px) {
  .default-navbar {
    &-web {
      display: none;
    }

    &-mobile {
      display: block;
    }
  }
}
</style>
