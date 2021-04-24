<template>
  <div>asdasd</div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue{
  name = 'sd';
  teste () {
    this.name = 'weliton';
    console.log(this.name);
  }
  created() {
    this.teste();
  }
  
}
</script>
