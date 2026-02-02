<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div v-if="Object.keys(dataItem).length" class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Compras {{ dataItem.date }}</p>
      </header>
      <section class="modal-card-body">

      </section>
      <footer class="modal-card-foot is-flex-end">
        <button class="button" type="button" @click="cancel">Cerrar</button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'KitchenBox',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    dataItem: {
      type: Object,
      default: () => {}
    },
    trashObjectName: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isModalActive: false
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    }
  },
  watch: {
    isActive (newValue) {
      this.isModalActive = newValue
    },
    isModalActive (newValue) {
      if (!newValue) {
        this.cancel()
      }
    }
  }
}
</script>
