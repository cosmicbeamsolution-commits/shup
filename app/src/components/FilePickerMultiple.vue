<template>
  <section>
    <b-field>
      <b-upload @input="upload" v-model="dropFiles"
          multiple
          drag-drop>
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon
                icon="upload"
                size="is-large">
              </b-icon>
            </p>
            <p>Arrastrá las imagenes acá o click para cargar</p>
          </div>
        </section>
      </b-upload>
    </b-field>
    <!--div class="tags">
      <span v-for="(file, index) in dropFiles"
        :key="index"
        class="tag is-primary" >
        {{file.name}}
        <button class="delete is-small"
            type="button"
            @click="deleteDropFile(index)">
        </button>
      </span>
    </div-->
  </section>
</template>

<script>
import axios from 'axios'
export default {
  name: 'FilePickerMultiple',
  data () {
    return {
      dropFiles: []
    }
  },
  props: {
    updateCollection: null,
    updateName: null,
    updateId: null
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
        .post(this.$store.state.endpoint + '/upload/multi', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: this.progressEvent
        })
        .then(res => {
          axios
            .post([this.$store.state.endpoint, this.updateCollection, this.updateId, this.updateName].join('/'), res.data)
            .then(r => {
            })
            .catch(err => {
              this.$buefy.toast.open({
                message: `Error: ${err.message}`,
                type: 'is-danger'
              })
            })
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
    }
  }
}
</script>
