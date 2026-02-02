<template>
  <div>
    <modal-box :is-active="isModalActive" :trash-object-name="trashObjectName" @confirm="trashConfirm" @cancel="trashCancel"/>
    <b-field>
      <b-upload @input="upload" v-model="dropFiles" multiple>
        <a class="button " :style="uploadPercent?'background: linear-gradient(to right,#f4f3ef '+uploadPercent+'px,transparent '+uploadPercent+'px)':''" :disabled="dataDisabled">
          <span>{{ buttonLabel }}</span>
        </a>
      </b-upload>
    </b-field>
  </div>
</template>

<script>
import axios from 'axios'
import ModalBox from '@/components/ModalBox'
export default {
  name: 'FilePickerMultiple',
  data () {
    return {
      isModalActive: false,
      trashObject: null,
      uploadPercent: 0,
      label: 'Cargar',
      dropFiles: []
    }
  },
  components: {
    ModalBox
  },
  props: {
    dataDisabled: null,
    dataLabel: null,
    updateCollection: null,
    updateName: null,
    updateId: null
  },
  computed: {
    trashObjectName () {
      if (this.trashObject) {
        return this.trashObject.name
      }

      return null
    },
    buttonLabel () {
      return this.dataLabel || this.label
    }
  },
  methods: {
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    },
    upload () {
      let formData = new FormData()
      this.dropFiles.forEach(file => {
        formData.append('files', file)
      })
      axios
        .post('/upload/multi', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: this.progressEvent
        })
        .then(res => {
          this.uploadPercent = 0
          this.dropFiles = []
          this.$emit('filesUploaded', res.data)
        })
        .catch(err => {
          this.$buefy.toast.open({
            message: `Error: ${err.message}`,
            type: 'is-danger'
          })
        })
    },
    progressEvent (progressEvent) {
      this.uploadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    },
    trashModal (trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm () {
      this.isLoading = true
      this.isModalActive = false
      axios
        .post(['upload', 'delete'].join('/'), {
          files: [this.trashObject]
        }).then(res => {
          this.isLoading = false
          this.$emit('filesUploaded', res.data)
        })
        .catch(e => {
          this.isLoading = false
          this.$buefy.toast.open({
            message: `Error: ${e.message}`,
            type: 'is-danger',
            queue: false
          })
        })
    },
    trashCancel () {
      this.isModalActive = false
    }
  }
}
</script>
