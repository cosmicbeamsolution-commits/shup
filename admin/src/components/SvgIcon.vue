<template>
  <span v-html="icons[icon]" class="svg-icon" :class="icon" :title="filterIcon" />
</template>

<script>
export default {
  props: ['icon'],
  computed: {
    filterIcon () {
      let reps = [
        { chevron_left: '' },
        { share: 'Compartir' },
        { phone: 'Teléfono' },
        { website: 'Sitio web' },
        { facebook: 'Facebook' },
        { instagram: 'Instagram' }
      ]
      let icon = this.icon
      reps.map((e, i) => {
        icon = icon.split(Object.keys(e)[0]).join(Object.values(e)[0])
      })
      return icon
    }
  },
  data () {
    return {
      icons: {
        burger: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17"><g id="Grupo_770" data-name="Grupo 770" transform="translate(-10412 7661)"><path id="Trazado_546" data-name="Trazado 546" d="M0,0H21" transform="translate(10413.5 -7659.5)" fill="none" stroke="#1db954" stroke-linecap="round" stroke-width="3"/><path id="Trazado_547" data-name="Trazado 547" d="M0,0H21" transform="translate(10413.5 -7652.5)" fill="none" stroke="#1db954" stroke-linecap="round" stroke-width="3"/><path id="Trazado_548" data-name="Trazado 548" d="M0,0H21" transform="translate(10413.5 -7645.5)" fill="none" stroke="#1db954" stroke-linecap="round" stroke-width="3"/></g></svg>',
        search: '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19"><g width="32" height="32" transform="translate(1.95 5)"><path d="M13.81,12.106,11.083,9.38a.656.656,0,0,0-.465-.191h-.446a5.685,5.685,0,1,0-.984.984v.446a.656.656,0,0,0,.191.465l2.726,2.726a.654.654,0,0,0,.927,0l.774-.774A.659.659,0,0,0,13.81,12.106ZM5.688,9.188a3.5,3.5,0,1,1,3.5-3.5A3.5,3.5,0,0,1,5.688,9.188Z" fill="#f4f3ef"/></g></svg>',
        bag: '<svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.47036 4.18675C3.63368 2.96283 4.67774 2.04883 5.91251 2.04883H16.2103C17.442 2.04883 18.4846 2.95855 18.6514 4.17898L20.7113 19.2514C20.9136 20.731 19.7636 22.0488 18.2703 22.0488H3.9013C2.41112 22.0488 1.26206 20.7363 1.45916 19.2592L3.47036 4.18675Z" stroke="#403939" fill="none" stroke-width="2.4"/><path d="M6.73901 6.35376V6.35376C8.09115 10.4038 13.8198 10.4038 15.1719 6.35376V6.35376" stroke="#403939" fill="none" stroke-width="2.4"/></svg>',
        magnify: '<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.7799" cy="10.4671" r="9.23228" stroke="#868686" fill="none" stroke-width="2.4"/><path d="M16.4624 16.2322L21.465 21.2349" stroke="#868686" stroke-width="2.4"/></svg>',
        table: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.89404" y="2.04883" width="20" height="20" rx="4" stroke="#403939" fill="none" stroke-width="2.4"/><path d="M1.89404 8.69531H21.894" stroke="#403939" fill="none" stroke-width="2.4"/><path d="M1.89404 15.3416H21.894" stroke="#403939" fill="none" stroke-width="2.4"/></svg>',
        grid: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.92114" y="2.04883" width="20" height="20" rx="4" stroke="#403939" fill="none" stroke-width="2.4"/><path d="M11.9211 2.04883L11.9211 22.0488" stroke="#403939" stroke-width="2.4"/><path d="M1.92114 12.0488H21.9211" stroke="#403939" fill="none" stroke-width="2.4"/></svg>',
        shop: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.94824" y="2.04883" width="20" height="20" rx="3.52237" stroke="#FAFAFA" stroke-width="2.4"/><rect x="7.7063" y="14.5405" width="8.48388" height="7.50806" rx="0.704474" stroke="#FAFAFA" stroke-width="2.4"/><path d="M1.94824 8.58276H21.9482" stroke="#FAFAFA" stroke-width="2.4"/></svg>',
        iso: '<svg width="42.13895" height="45.034985" viewBox="0 0 42.13895 45.034985" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 14.026711,43.034885 H 6.8267306 c -2.9,0 -5.1,-2.5081 -4.8,-5.3172 l 2.1,-21.0684 c 0.3,-2.5082 2.3,-4.4143 4.8,-4.4143 h 7.0999804 c -2.5,0 -4.6,1.9061 -4.8,4.4143 l -1.9999804,21.1687 c -0.2,2.7088 1.9999804,5.2169 4.7999804,5.2169 z" stroke="#403939" stroke-width="4" id="path4" /><path d="m 40.126611,37.834985 c 0.2,2.8 -2,5.2 -4.8,5.2 h -21.3 c -2.8,0 -5.0999804,-2.5 -4.7999804,-5.3 l 1.9999804,-21.1 c 0.2,-2.5 2.3,-4.4 4.8,-4.4 h 17.7 c 2.5,0 4.6,2 4.8,4.5 z" stroke="#403939" stroke-width="4" id="path6" /><path d="m 28.726711,5.8349552 c -2.9,-5.19999999 -10.4,-5.19999999 -13.3,0" stroke="#403939" stroke-width="4" id="path8" /><path d="m 29.526711,43.034985 h -8.9 c -0.4,0 -0.7,-0.3 -0.7,-0.7 v -6.4 c 0,-0.4 0.3,-0.7 0.7,-0.7 h 8.9 c 0.4,0 0.7,0.3 0.7,0.7 v 6.4 c 0,0.4 -0.4,0.7 -0.7,0.7 z" stroke="#403939" stroke-width="4" id="path10" /></svg>',
        'bag-add': '<svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.9392 5.15574C4.11388 3.84671 5.23055 2.86914 6.55118 2.86914H15.9504C17.2678 2.86914 18.3828 3.84212 18.5612 5.14744L20.4623 19.0568C20.6786 20.6393 19.4486 22.0488 17.8514 22.0488H4.69516C3.10136 22.0488 1.87238 20.6449 2.08319 19.0651L3.9392 5.15574Z" stroke="#FAFAFA" stroke-width="2.4"/><path d="M7.10547 6.99707V6.99707C8.40215 10.881 13.8958 10.881 15.1925 6.99707V6.99707" stroke="#FAFAFA" stroke-width="2.4"/><path d="M20.8711 2.86914H26.5121" stroke="#FAFAFA" stroke-width="2"/><path d="M23.6917 0.0488281L23.6917 5.68983" stroke="#FAFAFA" stroke-width="2"/></svg>'
      }
    }
  }
}
</script>
