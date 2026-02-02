<template>
  <div>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <div class="columns is-gallery">
      <div class="column is-6" v-for="(item, index) in dataGallery"
        :item="item"
        :key="index">
        <div class="box">
          <div class="columns">
            <div class="column photo-container">
              <div class="background-image" :style="`background-image: url(${item.src});${item.filtro}`"/>
              <button class="button is-large is-text" type="button" @click.prevent="trashModal(item)">
                <b-icon class="has-text-danger" icon="close" size="is-small"/>
              </button>
            </div>
            <div class="column">
              <div if="extra">
                <b-field>
                  <textarea class="textarea" v-model="item.caption" rows="2" placeholder="Descripción de la imagen"></textarea>
                </b-field>
                <b-field label="" expanded>
                  <b-select placeholder="Filtro" v-model="item.filtro" expanded>
                    <option v-for="(item, index) in dataFilters" :key="index" :value="item.filter">
                      {{ item.name }}
                    </option>
                  </b-select>
                </b-field>
                <!--b-field label="x">
                  <b-slider v-model="item.x"></b-slider>
                </b-field>
                <b-field label="y">
                  <b-slider v-model="item.y"></b-slider>
                </b-field>
                <b-field label="zoom">
                  <b-slider v-model="item.zoom" :step="10" :min="100" :max="999"></b-slider>
                </b-field-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ModalBox from '@/components/ModalBox'
export default {
  name: 'GalleryComponent',
  components: { ModalBox },
  props: {
    dataGallery: {
      type: Array,
      default: () => []
    },
    dataFilters: {
      type: Array,
      default: () => []
    },
    extra: null
  },
  data () {
    return {
      isModalActive: false,
      form: {}
    }
  },
  computed: {
    trashObjectName () {
      if (this.trashObject) {
        return this.trashObject.src
      }

      return null
    }
  },
  methods: {
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm () {
      this.isLoading = true
      this.isModalActive = false
      axios
        .post(['upload', 'delete'].join('/'), {
          files: [this.trashObject.src]
        }).then(res => {
          this.isLoading = false
          this.$emit('fileDeleted', res.data)
        })
    },
    trashCancel () {
      this.isModalActive = false
    }
  }
}
</script>
