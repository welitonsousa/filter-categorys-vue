<template>
  
    <div class="q-card col-11 col-md-5 q-mb-md">
      <q-input outlined v-model="input.value" :label="input.label" />
      <div class="q-pa-md">
        <q-table
          row-key="value"
          selection="multiple"
          :title="label"
          rows-per-page-label="Itens por página"
          :hide-selected-banner="true"
          :data="itemsFiltred"
          :selected.sync="selectedsItems"
          :pagination.sync="pagination"
          :columns="columns"
        />
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from 'vue-property-decorator';
import { InfoInput } from '../models/model_info_input';
import { IFilter, FilterOption, Filter } from '../models/model_category';

@Component({})
export default class Home extends Vue {
  @PropSync('listItems') items!: IFilter[]
  @Prop(String) saveName!: string;
  @Prop(Number) idFilter!: number;
  @Prop(Number) idFilterCatefory!: number;
  @Prop(String) label!: string;

  input = new InfoInput('Digite aqui', '');
  itemsFormated: FilterOption[] = [];
  itemsFiltred: FilterOption[] = [];

  @Watch('items')
  updateitems(): void {
    this.itemsFormated = this.searchCategoriesById(
      this.searchFilterById(this.items, this.idFilter),
      this.idFilterCatefory
    ).filterOptions;
    this.itemsFiltred = [...this.itemsFormated];
  }

  selectedsItems = JSON.parse(
    localStorage.getItem(`selecteds${this.saveName}`) || '[]'
  ) as [];

  pagination = { rowsPerPage: 10 };
  columns = [
    {
      name: 'label',
      label: 'Grupo de setores',
      align: 'left',
      field: 'label',
      sortable: true
    }
  ];

  @Watch('input', { deep: true })
  filterCnaes(): void {
    this.itemsFiltred = [
      ...this.itemsFormated.filter(e => {
        return e.label.toLowerCase().includes(this.input.value.toLowerCase());
      })
    ];
  }

  @Watch('selectedsItems', { deep: true })
  saveSelectedsCnaes(): void {
    localStorage.setItem(
      `selecteds${this.saveName}`,
      JSON.stringify(this.selectedsItems)
    );
  }

  searchFilterById(filters: IFilter[], id: number): IFilter {
    return (
      filters.find((filter: IFilter) => filter.id == id) || { filters: [] }
    );
  }

  searchCategoriesById(response: IFilter, id: number): Filter {
    return response.filters.find(e => e.id == id) || { filterOptions: [] };
  }
}
</script>
