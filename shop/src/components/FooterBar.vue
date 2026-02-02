<template>
  <footer class="animated fadeIn delay3">
    <div class="content">
      <div class="columns is-mobile is-vcentered is-centered created-with">
        <div class="column is-narrow">
          <span class="is-size-7 has-text-light has-text-color">Creado con</span>
        </div>
        <div class="column is-narrow">
          <a href="https://overlemon.com" target="_blank">
            <!--img src="/img/GeoCyan.svg"/-->
            <svg-icon icon="monogram"/>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'FooterBar',
  components: {
    SvgIcon
  }
}
</script>
