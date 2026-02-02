<template>
  <div>
    <b-dropdown @input="setInput" v-model="selection" :max-height="200" aria-role="list">
      <button class="button" slot="trigger">
        <span>{{ getSelected }}</span>
      </button>
      <b-dropdown-item aria-role="listitem" v-for="(item,index) in dataItems" :key="index" :value="item.value" expand @click="setLabel(item)"><span>{{ item.label }}</span></b-dropdown-item>
    </b-dropdown>
    <span v-show="dataCaption" class="has-text-grey is-size-7">{{ dataCaption }}</span>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    dataItems: {
      type: Array,
      default: () => []
    },
    dataCaption: null,
    dataLabel: null
  },
  computed: {
    getSelected: function () {
      return this.label || this.dataLabel
    }
  },
  methods: {
    setInput: function (value) {
      this.$emit('valueChanged', value)
    },
    setLabel: function (value) {
      this.label = value.label
    }
  },
  data () {
    return {
      label: null,
      selection: null
    }
  }
}
</script>
