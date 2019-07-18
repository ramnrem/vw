<template>
  <div v-if="event">
    <div
      class="calendar-event"
      @click="handleClick"
      :style="eventStyle"
    >
      <div class="calendar-event__title">
        <div v-if="event.code == 'cost_price'">
          <span v-if="event.meta.bs" class="calendar-event__bs">BS</span>
          <span v-if="event.meta.code == 'OE'" class="calendar-event__code">{{event.meta.code}}</span>
          <span v-if="event.meta.number_participant > 0" :class="`calendar-event__number_participant calendar-event__number_participant--${event.meta.number_participant < 15 ? 'small' : 'big'}`">{{event.meta.number_participant}}</span>
          <span v-if="event.meta.code == 'CC'" class="calendar-event__account_name">{{event.meta.account_name}}</span>
          <span class="calendar-event__course-code">{{event.meta.course_code}}</span>
          <span class="calendar-event__trainer-codes">{{event.meta.trainer_codes}}</span>
          <span class="calendar-event__note">{{event.meta.note}}</span>
        </div>
        <div v-else-if="event.code == 'trainer_absence'">
          <span>{{event.meta.reason}}: {{event.meta.note}}</span>
        </div>        
        <div v-else-if="event.code == 'room_reservation'">
          <span>Резерв №{{event.meta.id}}</span>
        </div>
        <div v-else-if="event.code == 'simple'">
          <span>{{event.meta.name}}</span>
        </div>        
      </div>
    </div>    
  </div>
</template>

<script>
export default {
  name: "CalendarEvent",
  props: {
    event: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      model: null
    };
  },
  computed: {    
    eventStyle() {
      return `background-color: ${this.event.bg_color}; color: ${this.event.fg_color}; border: 1px solid ${this.event.bd_color};`;
    },
    resource(){
      if(this.event.code === 'cost_price'){
        return `cost_prices/${this.event.meta.id}`
      }else if(this.event.code === 'roomt_reservation'){
        return `room_reservations/${this.event.meta.id}`
      }else if(this.event.code === 'trainer_absence'){
        return `calendar/trainer_absences/${this.event.meta.id}`
      }

      return
    },
    form(){      
      if(this.event.code === 'cost_price'){
        return 'cost-price-form'
      }else if(this.event.code === 'roomt_reservation'){
        return 'room-reservation-form'
      }else if(this.event.code === 'trainer_absence'){
        return 'trainer-absence-form'
      }

      return
    }
  },
  methods: {    
    handleClick() {
      if (!this.resource) return;

      this.loading = true;
      this.$resource(this.resource)
        .get()
        .then(response => {
          this.$emit('click', { model: response.data, form: this.form })
          this.loading = false;          
        });
    }   
  }
};
</script>