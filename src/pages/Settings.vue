<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm  q-py-sm">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card>
          <q-table
            title="Product Types"
            :data="productTypesObject"
            :hide-header="mode === 'grid'"
            :columns="productTypeColumns"
            row-key="name"
            :grid="mode=='grid'"
            :pagination.sync="pagination"
          >
            <template v-slot:body-cell-action="props">
              <q-td :props="props" style="width:50px">
                <div class="q-gutter-sm">
                  <q-btn dense color="primary" icon="edit" @click="showProductTypeDialog(props.row.name)"/>
                  <q-btn dense color="red" icon="delete"/>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
      <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <q-card>
          <q-table
            title="Product Categories"
            class="my-sticky-column-table"
            :data="productCategories"
            :hide-header="mode === 'grid'"
            :columns="productCategoriesColumns"
            row-key="name"
            :grid="mode=='grid'"
            :pagination.sync="pagination"
          >
            <template v-slot:body-cell-categoryIcon="props">
              <q-td :props="props">
                <q-icon 
                :name="(props.row.categoryIcon) ? props.row.categoryIcon : 'extension'" 
                class="cursor-pointer"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props" style="max-width:50px">
                <div class="q-gutter-sm">
                  <q-btn dense color="primary" icon="edit" @click="showProductCategoryDialog(props.row)"/>
                  <q-btn dense color="red" icon="delete"/>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="productTypeDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px" class="column">
      <q-form ref="productTypeForm">
        <q-card-section>
          <div class="text-h6">{{(currentProductType)?'Update': 'Add'}} Product Type</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-item>
            <q-input
              outlined
              color="primary"
              for="type"
              lazy-rules="lazy-rules"
              name="type"
              label="Type"
              value=""
              style="width: 100%"
              v-model="currentProductType"
              :rules="[val => !!val || '*Field is required']"
            />
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCEL" color="primary" v-close-popup />
          <q-btn flat label="OK"/>
        </q-card-actions>
      </q-form>
      </q-card>
    </q-dialog>
    
    <q-dialog v-model="productCategoryDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px" class="column">
      <q-form ref="productCategoryForm">
        <q-card-section>
          <div class="text-h6">{{productCategoryDialogTitle}} Product Category</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-item>
            <q-input
              outlined
              color="primary"
              for="type"
              lazy-rules="lazy-rules"
              name="type"
              label="Category"
              value=""
              style="width: 100%"
              v-model="currentProductCategory.name"
              :rules="[val => !!val || '*Field is required']"
            />
          </q-item>
          <q-item>
            <q-select 
              outlined
              color="primary"
              for="type"
              lazy-rules="lazy-rules"
              name="type"
              label="Type"
              style="width: 100%"
              :options="productTypes"
              v-model="currentProductCategory.productType"
              :rules="[val => !!val || '*Field is required']"
            />
          </q-item>
          <q-item>
            <q-input 
              outlined
              color="primary"
              for="icon"
              lazy-rules="lazy-rules"
              name="icon"
              value=""
              style="width: 100%"
              v-model="currentProductCategory.categoryIcon" 
              label="Icon" 
              readonly
              clearable>
              <template v-slot:append>
                <q-icon :name="(currentProductCategory.categoryIcon)?currentProductCategory.categoryIcon:'extension'" class="cursor-pointer">
                  <q-popup-proxy v-model="showIconPicker">
                    <q-icon-picker
                      icon-set="material-icons"
                      :pagination.sync="iconPagination"
                      v-model="currentProductCategory.categoryIcon"
                      style="height: 300px; width: 300px; background-color: white;"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCEL" color="primary" v-close-popup />
          <q-btn flat label="OK" @click="saveProductCategory"/>
        </q-card-actions>
      </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      mode: "list",
      selectedIcon: '',
      currentProductType: '',
      productTypeDialog: false,
      currentProductCategory: {},
      productCategoryDialog: false,
      productTypeColumns: [
        {
          name: "productType",
          required: true,
          label: "Type Label",
          align: "left",
          field: "productType",
          sortable: true
        },
        {
          name: "action",
          align: "center",
          label: "",
          field: "action",
          sortable: true
        }
      ],
      showIconPicker: false,
      pagination: {
        rowsPerPage: 10
      },
      iconPagination: {
        itemsPerPage: 35,
        page: 0
      },
      productCategoriesColumns: [
        {
          name: "categoryName",
          required: true,
          label: "Category Label",
          align: "left",
          field: "categoryName",
          sortable: true
        },
        {
          name: "productType",
          required: true,
          label: "Product Type",
          align: "left",
          field: "productType",
          sortable: true
        },
        {
          name: "categoryIcon",
          required: true,
          label: "Icon",
          align: "left",
          field: "categoryIcon",
          sortable: true
        },
        {
          name: "action",
          align: "center",
          label: "",
          field: "action",
          sortable: true
        }
      ],
    };
  },
  mounted: function() {
    this.getProductCategories();
    this.getProductTypes();
  },
  computed: {
    ...mapGetters('product', ['productCategories', 'productTypes']),
    productTypesObject: {
      get(){
        return this.productTypes.map(t => {
          return {productType: t}
        })
      }
    },
    currentProductCategoryIcon: {
      get() {
        return this.currentProductCategory.categoryIcon
      }
    },
    productCategoryDialogTitle: {
      get() {
        return (this.currentProductCategory) ? 'Update' : 'Add'
      }
    },
    isUpdatingProductCategory: {
      get() {
        return (this.currentProductCategory) ? true : false
      }
    }
  },
  methods: {
    ...mapActions('product', ['getProductCategories', 'getProductTypes', 'updateProductCategory', 'addProductCategory']),
    showProductTypeDialog(type){
      this.currentProductType = type;
      this.productTypeDialog = true;
    },
    showProductCategoryDialog(category){
      if(!category){
        this.currentProductCategory = {}
        this.productCategoryDialog = false
      }
      else {
        this.currentProductCategory= {...category}
        this.productCategoryDialog = true
      }
    },
    async saveProductCategory () {
       this.$q.loading.show({
        message: this.productCategoryDialogTitle + ' product category, please stand by...',
        customClass: 'text-h3, text-bold'
      })
      try {
        if (this.isUpdatingProductCategory) {
          await this.updateProductCategory(this.currentProductCategory)
        } else {
          await this.addProductCategory(this.currentProductCategory)
        }
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem ${this.productCategoryDialogTitle} the product category: ${err}`,
          color: 'negative'
        })
      } finally {
        this.$q.loading.hide()
        this.showProductCategoryDialog(false)
      }
    },
  },
  watch: {
    currentProductCategoryIcon () {
      this.showIconPicker = false
    }
  }
};
</script>

<style lang="sass">
.my-sticky-column-table
  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #fff

  td:first-child
    background-color: #f5f5dc

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>