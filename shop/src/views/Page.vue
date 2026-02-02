<template>
  <div>
    <header-component/>
    <div class="content is-bottom-extra-extra-padded animated fadeIn delay">
      <card-component :is-float="true" class="is-white">
        <h4>
          <span>No encontramos lo que estás buscando</span>
        </h4>
        <hr>
        <div>
          <span>Por favor revisá la URL. Si creés que se trata de un error contactanos. </span>
          <hr>
          <div class="columns is-centered">
            <div class="column is-narrow">
              <router-link to="/" class="button is-info is-outlined">Volver a inicio</router-link>
            </div>
            <div class="column is-narrow">
              <router-link to="/contacto" class="button is-info is-outlined">Contactar al administrador</router-link>
            </div>
          </div>
        </div>
      </card-component>
    </div>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent'
import HeaderComponent from '../components/HeaderComponent'
export default {
  name: 'page',
  components: {
    CardComponent,
    HeaderComponent
  }
}
</script>
