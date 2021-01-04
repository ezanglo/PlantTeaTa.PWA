<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="Product Management"
        :data="allProducts"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right="props">
          <q-btn @click="showProductDialog({}, 'Add Product')" outline color="primary" label="Add New" class="q-mr-xs"/>

          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>

          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            v-if="mode === 'list'"
          >
            <q-tooltip
              :disable="$q.platform.is.mobile"
              v-close-popup
            >{{props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}}
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            :icon="mode === 'grid' ? 'list' : 'grid_on'"
            @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
            v-if="!props.inFullscreen"
          >
            <q-tooltip
              :disable="$q.platform.is.mobile"
              v-close-popup
            >{{mode==='grid' ? 'List' : 'Grid'}}
            </q-tooltip>
          </q-btn>

          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="exportTable"
          />
        </template>
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <q-btn round dense flat icon="monetization_on">
              <q-menu>
                <q-list>
                  <q-item v-for="price in props.row.productPrice" :key="price.id">
                    <q-item-section>
                      <q-item-label>{{ price.productPrice }} per {{ price.productSize }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <!-- <q-item-label>{{props.row.productPrice}}</q-item-label> -->
              <q-btn dense color="primary" icon="edit" @click="showProductDialog(props.row); setBlur()"/>
              <q-btn dense color="red" icon="delete" @click="showConfirmDialog(props.row)"/>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="productDialog" full-height="full-height" persistent="persistent" @before-hide="setBlur">
        <product-settings 
        :meta="currentProduct" 
        :productCategories="productCategories"
        :productTypes="productTypes"
        ></product-settings>
    </q-dialog>
    <q-dialog v-model="confirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete {{currentProduct.productName}}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="deleteCurrentProduct()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {exportFile} from "quasar";
import { mapGetters, mapActions, mapMutations } from 'vuex'

function wrapCsvValue(val, formatFn) {
    let formatted = formatFn !== void 0 ? formatFn(val) : val;

    formatted =
        formatted === void 0 || formatted === null ? "" : String(formatted);

    formatted = formatted.split('"').join('""');

    return `"${formatted}"`;
}

export default {
  components: {
    'product-settings': () => import('../components/ProductSettings.vue')
  },
  data() {
    return {
      filter: "",
      customer: {},
      mode: "list",
      columns: [
        {
          name: "product_name",
          required: true,
          label: "Product",
          align: "left",
          field: "productName",
          sortable: true
        },
        {
          name: "product_category",
          align: "left",
          label: "Category",
          field: "productCategory",
          sortable: true
        },
        {
          name: "product_type",
          align: "left",
          label: "Type",
          field: "productType",
          sortable: true
        },
        {
          name: "price",
          align: "left",
          label: "Prices",
          field: "productPrice",
          sortable: true,
        },
        {
          name: "action",
          align: "left",
          label: "Action",
          field: "action",
          sortable: true
        }
      ],
      pagination: {
        rowsPerPage: 10
      },
      currentProduct: {},
      confirmDialog: false
    };
  },
  mounted: function() {
    this.getAllProducts();
    this.getProductPrices();
    this.getProductCategories();
    this.getProductTypes();
  },
  computed: {
    ...mapGetters('product', ['allProducts', 'productCategories', 'productTypes', 'productPrices']),
    productDialog: {
      get () {
        return this.$store.state.product.productDialog
      },
      set (val) {
        this.setProductDialog(val)
      }
    }
  },
  methods: {
    ...mapMutations('product', ['setProductDialog']),
    ...mapActions('product', ['getAllProducts', 'deleteProduct', 'getProductCategories', 'getProductTypes', 'getProductPrices']),
    async deleteCurrentProduct() {
      try {
        await this.deleteProduct(this.currentProduct.id)
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem delete product: ${err}`,
          color: 'negative'
        })
      } finally {
        this.$q.loading.hide()
      }
    },
    showConfirmDialog (currentProduct) {
      this.confirmDialog = true;
      this.currentProduct = currentProduct
    },
    showProductDialog (currentProduct) {
      this.productDialog = true
      this.currentProduct = currentProduct
    },
    setBlur () {
      this.$emit('setBlur')
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("customer-management.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>
