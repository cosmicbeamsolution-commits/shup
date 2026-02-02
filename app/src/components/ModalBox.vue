<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="columns is-vcentered is-center">
      <div class="column">
        <div class="card card-floating">
          <div class="card-content">
            <div class="content has-text-centered">
              <div class="is-spaced">
                <h3>Compartir perfil de {{ dataItem.empresa | sanitize }}</h3>
                <p>Contribuye a que se conozca mejor en las redes. ¡Y no te olvides de agregarle un lindo comentario!</p>
              </div>
              <div class="columns is-vcentered is-center">
                <div class="column">
                  <a :href="`https://www.facebook.com/sharer/sharer.php?u=${shareURL}${dataItem._id}`" target="_blank">
                    <b-icon icon="facebook" size="is-large"/>
                  </a>
                  <a :href="`https://twitter.com/share?url=${shareURL}${dataItem._id}&text=${dataItem.empresa} en YA CABRÓN`" target="_blank">
                    <b-icon icon="twitter" size="is-large"/>
                  </a>
                  <a :href="`https://pinterest.com/pin/create/button/?url=${shareURL}${dataItem._id}&media=&description=Ver ${dataItem.empresa} en YA CABRÓN`" target="_blank">
                    <b-icon icon="pinterest" size="is-large"/>
                  </a>
                  <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${shareURL}${dataItem._id}&title=&summary=Ver ${dataItem.empresa} en YA CABRÓN&source=`" target="_blank">
                    <b-icon icon="linkedin" size="is-large"/>
                  </a>
                  <a :href="`mailto:info@example.com?&subject=&body=${localURL}${dataItem._id} Ver ${dataItem.empresa} en YA CABRÓN`" target="_blank">
                    <b-icon icon="email" size="is-large"/>
                  </a>
                </div>
              </div>
              <a @click="cancel" class="button is-danger is-rounded is-outlined has-text-danger"><span>Cerrar</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'ModalBox',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    dataItem: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      shareURL: null,
      localURL: null,
      isModalActive: false
    }
  },
  created () {
    this.shareURL = this.$store.state.shareendpoint + '/proveedores/'
    this.localURL = location.origin + '/proveedores/'
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
