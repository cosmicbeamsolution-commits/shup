<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="columns is-vcentered is-center">
      <div class="column">
        <div class="card card-floating is-white">
          <div class="card-content">
            <div class="content has-text-centered">
              <div class="is-spaced">
                <h3>Compartir {{ dataName }}</h3>
                <p>Contribuye a que se conozca mejor en las redes. ¡Y no te olvides de agregarle un lindo comentario!</p>
              </div>
              <div class="columns is-mobile is-vcentered is-centered is-share-icons">
                <div class="column is-narrow">
                  <div class="control is-condensed whatsapp">
                    <a :href="`https://wa.me/?text=${shareURL}/${dataItem._id}`" target="_blank">
                      <b-icon icon="whatsapp" size="is-medium"/>
                    </a>
                  </div>
                </div>
                <div class="column is-narrow">
                  <div class="control is-condensed facebook">
                    <a :href="`https://www.facebook.com/sharer/sharer.php?u=${shareURL}/${dataItem._id}`" target="_blank">
                      <b-icon icon="facebook" size="is-medium"/>
                    </a>
                  </div>
                </div>
                <div class="column is-narrow">
                  <div class="control is-condensed twitter">
                    <a :href="`https://twitter.com/share?url=${shareURL}/${dataItem._id}&text=${dataName} en geotiendas`" target="_blank">
                      <b-icon icon="twitter" size="is-medium"/>
                    </a>
                  </div>
                </div>
                <div class="column is-narrow">
                  <div class="control is-condensed pinterest">
                    <a :href="`https://pinterest.com/pin/create/button/?url=${shareURL}/${dataItem._id}&media=&description=Ver ${dataName} en geotiendas`" target="_blank">
                      <b-icon icon="pinterest" size="is-medium"/>
                    </a>
                  </div>
                </div>
                <div class="column is-narrow">
                  <div class="control is-condensed linkedin">
                    <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${shareURL}/${dataItem._id}&title=&summary=Ver ${dataName} en geotiendas&source=`" target="_blank">
                      <b-icon icon="linkedin" size="is-medium"/>
                    </a>
                  </div>
                </div>
                <div class="column is-narrow">
                  <div class="control is-condensed email">
                    <a :href="`mailto:info@example.com?&subject=&body=${localURL} Ver ${dataName} en geotiendas`" target="_blank">
                      <b-icon icon="email" size="is-medium"/>
                    </a>
                  </div>
                </div>
              </div>
              <a @click="cancel" class="button is-grey"><span>Cerrar</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'ModalShare',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    dataItem: {
      type: Object,
      default: () => {}
    },
    dataType: {
      type: String,
      default: 'shop'
    }
  },
  computed: {
    getType () {
      return this.dataType === 'shop' ? 'shop' : 'name'
    },
    dataName () {
      return this.dataItem[this.getType]
    }
  },
  data () {
    return {
      shareURL: null,
      localURL: null,
      isModalActive: false
    }
  },
  methods: {
    getShareUrl () {
      return this.dataType === 'shop' ? 'shop' : `stock/${this.dataItem.pid}`
    },
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
      } else {
        this.shareURL = `${this.$store.state.shareapi}/${this.getShareUrl()}`
        this.localURL = location.origin
      }
    }
  }
}
</script>
