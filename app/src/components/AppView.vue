<template>
  <div class="app-view">
    <section-background :shortSection="true">
      <slot name="background"/>
    </section-background>
    <div class="container">
      <div class="content column">
        <div class="columns">
          <div class="column">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionBackground from '../components/SectionBackground'
export default {
  name: 'AppView',
  components: {
    SectionBackground
  }
}
</script>
