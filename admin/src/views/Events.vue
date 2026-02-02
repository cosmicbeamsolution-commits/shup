<template>
  <div>
    <nav-bar/>
    <aside-menu/>
    <hero-bar>
      <b-icon icon="timeline-clock" size="is-medium"/>
      Eventos
    </hero-bar>
    <section v-show="Object.keys(connected).length" class="section is-main-section content">
      <h3>Tiendas ahora</h3>
      <tiles>
        <card-widget v-for="(item, index) in connected" :key="index" class="tile is-child" type="is-success" icon="shopping" :number="item.length" :label="index"/>
      </tiles>
    </section>
    <section v-show="users.length" class="section content">
      <h3>Usuarios 30min</h3>
      <div  v-for="(item, index) in users" :key="index" class="field">
        <card-user-stats class="tile is-child" type="is-success" icon="account" :item="item"/>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import HeroBar from '@/components/HeroBar'
import Tiles from '@/components/Tiles'
import CardWidget from '@/components/CardWidget'
import CardUserStats from '@/components/CardUserStats'
export default {
  name: 'events',
  components: {
    NavBar,
    AsideMenu,
    CardWidget,
    CardUserStats,
    Tiles,
    HeroBar
  },
  data () {
    return {
      days: 0.020833333,
      users: [],
      connected: []
    }
  },
  sockets: {
    connected (data) {
      this.connected = data
    },
    event (data) {
      this.$buefy.toast.open({
        message: `Actualizando datos en tiempo real`,
        type: 'is-success'
      })
      this.users.push(data)
      this.updateUsers()
    }
  },
  created () {
    setTimeout(() => {
      this.$socket.emit('findConnectedAll')
      this.updateUsers()
    }, 1000)
  },
  methods: {
    updateUsers () {
      axios.post('/admin/users', {
        days: this.days
      }).then((res) => {
        if (res.data.status === 'success') {
          this.users = res.data.users.reverse()
        }
      })
    }
  }
}
</script>
