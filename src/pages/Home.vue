<template>
  <q-page-container class="row justify-around">
    <div>
      <q-input
        rounded
        outlined
        v-model="inputCnaes.value"
        :label="inputCnaes.label"
      />
      <div class="q-pa-md">
        <q-table
          title="CNAEs"
          row-key="value"
          selection="multiple"
          rows-per-page-label="Itens por página"
          :data="cnaesFiltred"
          :selected.sync="selectedsCnaes"
          :pagination.sync="paginationCnaes"
          :columns="columns"
        />
      </div>
    </div>
    <div>
      <q-input
        rounded
        outlined
        v-model="inputCountry.value"
        :label="inputCountry.label"
      />
      <div class="q-pa-md">
        <q-table
          title="Municipios"
          row-key="value"
          selection="multiple"
          rows-per-page-label="Itens por página"
          :data="countryFiltred"
          :selected.sync="selectedsCountry"
          :pagination.sync="paginationCoutry"
          :columns="columns"
        />
      </div>
    </div>
  </q-page-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { InfoInput } from '../models/mdoel_info_input';
import { IFilter, FilterOption, Filter } from '../models/model_category';

@Component({})
export default class Home extends Vue {
  inputCnaes = new InfoInput('Digite aqui', '');
  inputCountry = new InfoInput('Digite aqui', '');

  filters: IFilter[] = [];

  selectedsCnaes = JSON.parse(
    localStorage.getItem('selectedsCnaes') || '[]'
  ) as [];
  cnaes: FilterOption[] = [];
  cnaesFiltred: FilterOption[] = [];

  selectedsCountry = JSON.parse(
    localStorage.getItem('selectedsCountry') || '[]'
  ) as [];
  country: FilterOption[] = [];
  countryFiltred: FilterOption[] = [];

  paginationCnaes = { rowsPerPage: 10 };
  paginationCoutry = { rowsPerPage: 10 };

  columns = [
    {
      name: 'label',
      label: 'Grupo de setores',
      align: 'left',
      field: 'label',
      sortable: true
    }
  ];

  created() {
    this.permissionNewRequest();
  }

  @Watch('inputCnaes', { deep: true })
  filterCnaes() {
    this.cnaesFiltred = [
      ...this.cnaes.filter(e => {
        return e.label
          .toLowerCase()
          .includes(this.inputCnaes.value.toLowerCase());
      })
    ];
  }

  @Watch('inputCountry', { deep: true })
  filterCountry() {
    this.countryFiltred = [
      ...this.country.filter(e => {
        return e.label
          .toLowerCase()
          .includes(this.inputCountry.value.toLowerCase());
      })
    ];
  }

  @Watch('selectedsCnaes', { deep: true })
  saveSelectedsCnaes() {
    localStorage.setItem('selectedsCnaes', JSON.stringify(this.selectedsCnaes));
  }

  @Watch('selectedsCountry', { deep: true })
  saveSelectedsCountry() {
    localStorage.setItem(
      'selectedsCountry',
      JSON.stringify(this.selectedsCountry)
    );
  }

  async getFilters() {
    try {
      console.log('new request');
      const response = await this.$axios.get('filters.json');
      this.filters = response.data.filters as IFilter[];
      this.addData(this.filters, true);
    } catch (error) {
      console.log(error);
    }
  }

  addData(filters: IFilter[], save: boolean): void {
    if (save) {
      localStorage.setItem('filters', JSON.stringify(this.filters));
    }

    //get cnaes
    this.cnaes = this.searchCategoriesById(
      this.searchFilterById(filters, 1),
      1
    ).filterOptions;
    this.cnaesFiltred = [...this.cnaes];

    //get country
    this.country = this.searchCategoriesById(
      this.searchFilterById(filters, 2),
      7
    ).filterOptions;
    this.countryFiltred = [...this.country];
  }

  searchFilterById(filters: IFilter[], id: number): IFilter {
    return (
      filters.find((filter: IFilter) => filter.id == id) || { filters: [] }
    );
  }

  searchCategoriesById(response: IFilter, id: number): Filter {
    return response.filters.find(e => e.id == id) || { filterOptions: [] };
  }

  permissionNewRequest() {
    const lastRequestString = localStorage.getItem('lastRequest') || '';
    let lastRequest;
    if (lastRequestString) {
      //no date saved
      lastRequest = new Date(lastRequestString);
    }

    if (!lastRequest) {
      //first request
      localStorage.setItem('lastRequest', Date());
      this.getFilters();
    } else {
      //no first request
      const now = new Date();
      const diff = Math.abs(now.getTime() - lastRequest.getTime());
      const minutes = Math.floor(Math.abs(diff) / 1000 / 60);

      if (minutes >= 5) {
        //local data no is valid
        localStorage.setItem('lastRequest', Date());
        this.getFilters();
      } else {
        //local data is valid
        this.filters = JSON.parse(
          localStorage.getItem('filters') || '[]'
        ) as IFilter[];
        this.addData(this.filters, false);
      }
    }
  }
}
</script>
