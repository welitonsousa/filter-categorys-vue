<template>
  <q-page-container class="row justify-evenly">
    <component-filter :label="'Cnaes'" :listItems="filters" :saveName="'cnaes'" :idFilter="1" :idFilterCatefory="1"/>
    <component-filter :label="'Municipios'" :listItems="filters" :saveName="'country'" :idFilter="2" :idFilterCatefory="7"/>
  </q-page-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IFilter } from '../models/model_category';
import componentFilter from '../components/componentFilterMultiSelect.vue';

@Component({
  components: {
    componentFilter
  }
})

export default class Home extends Vue {
  filters: IFilter[] = [];

  async created(): Promise<void> {
    await this.permissionNewRequest();
  }

  async getFilters(): Promise<void> {
    try {
      const response = await this.$axios.get('filters.json');
      this.filters = response.data.filters as IFilter[];
      this.saveFilters();
    } catch (error) {
      console.log(error);
    }
  }

  saveFilters(): void {
    localStorage.setItem('filters', JSON.stringify(this.filters));
  }

  async permissionNewRequest(): Promise<void> {
    const lastRequestString = localStorage.getItem('lastRequest') || '';
    let lastRequest;
    if (lastRequestString) {
      //no date saved
      lastRequest = new Date(lastRequestString);
    }

    if (!lastRequest) {
      //first request
      localStorage.setItem('lastRequest', Date());
      await this.getFilters();
    } else {
      //no first requ5rest
      const now = new Date();
      const diff = Math.abs(now.getTime() - lastRequest.getTime());
      const minutes = Math.floor(Math.abs(diff) / 1000 / 60);

      if (minutes >= 5) {
        //local data no is valid
        localStorage.setItem('lastRequest', Date());
        await this.getFilters();
      } else {
        //local data is valid
        this.filters = await JSON.parse(
          localStorage.getItem('filters') || '[]'
        ) as IFilter[];
      }
    }
  }
}
</script>
