<template>
  <div>
    <b-field class="file">
      <b-upload v-model="file" @input="upload" class="is-clickable" :accept="accept">
        <a v-if="buttonLabel" class="button is-dark is-outlined" :style="uploadPercent?'background: linear-gradient(to right,#f4f3ef '+uploadPercent+'px,transparent '+uploadPercent+'px)':''">
          <span >{{ buttonLabel }}</span>
        </a>
        <b-icon else icon="file-upload" type="is-primary" size="is-medium"/>
      </b-upload>
      <!--span class="file-name" v-if="file">{{ file.name }}</span-->
    </b-field>
    <div v-show="uploadPercent" class="is-upload-progress animated loop flash" :style="uploadPercent?'background: linear-gradient(to right,#00d1b2 '+uploadPercent+'px,transparent '+uploadPercent+'px)':''"/>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'FilePicker',
  props: {
    dataLabel: null,
    dataVideo: null,
    accept: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      label: 'Cargar',
      file: null,
      uploadPercent: 0
    }
  },
  computed: {
    buttonLabel () {
      return this.dataLabel
    },
    video () {
      return this.dataVideo || false
    }
  },
  methods: {
    upload (file) {
      let formData = new FormData()
      formData.append('files', file)
      axios.post('/upload/multi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: this.progressEvent
      }).then(res => {
        if (res.data.status === 'error') {
          this.$buefy.toast.open({
            message: `Error: ${res.data.message}`,
            type: 'is-danger'
          })
        } else {
          this.uploadPercent = 0
          this.$emit('fileUploaded', res.data)
        }
      }).catch(err => {
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
