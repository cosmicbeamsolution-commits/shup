<template>
  <div v-show="form.photo" class="box has-text-right">
    <button class="button is-large is-text" type="button" @click.prevent="trashModal(form.photo)">
      <b-icon class="has-text-danger" icon="close" size="is-small"/>
    </button>
    <img :src="form.photo" :style="form.filtro" />
  </div>
</template>

<script>
export default {
  name: 'PhotoComponent'
}
</script>
