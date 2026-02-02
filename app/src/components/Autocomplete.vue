<template>
  <section>
    <b-field class="is-marginless" label="">
      <b-autocomplete
        v-model="name"
        ref="autocomplete"
        :data="filteredDataArray"
        :open-on-focus="true"
        :placeholder="dataLabel"
        field="label"
        @select="option => selected = option"
        @input="emitValue">
        <template slot="empty">No hay resultados para <strong>{{ name }}</strong></template>
      </b-autocomplete>
    </b-field>
      <span v-show="dataCaption" class="has-text-grey is-size-7">{{ dataCaption }}</span>
  </section>
</template>

<script>
export default {
  name: 'Autocomplete',
  props: {
    dataItems: {
      type: Array,
      default: () => []
    },
    dataCaption: null,
    dataLabel: null
  },
  computed: {
    filteredDataArray () {
      return this.dataItems.filter((option) => {
        return option.label
          .toString()
          .toLowerCase()
          .indexOf(this.name.toLowerCase()) >= 0
      })
    },
    getSelected: function () {
      return this.label || this.dataLabel
    }
  },
  methods: {
    emitValue: function (value) {
      let option = this.dataItems.filter(e => e.label === value)
      if (option[0]) {
        this.$emit('valueChanged', option[0].value)
      }
    },
    setLabel: function (value) {
      this.label = this.selected.value
    }
  },
  data () {
    return {
      value: null,
      selected: null,
      label: null,
      name: ''
    }
  }
}
</script>
