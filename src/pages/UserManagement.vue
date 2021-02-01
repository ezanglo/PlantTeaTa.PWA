<template>
<q-pull-to-refresh @refresh="refresh" color="primary">
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="User Management"
        :data="allUsers"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right="props">
          <q-btn @click="new_customer=true" outline color="primary" label="Add New" class="q-mr-xs"/>

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
        <template v-slot:body-cell-profile_photo="props">
          <q-td :props="props">
            <q-item round>
            <q-avatar size="26px">
              <q-img :src="(props.row.profilePhoto) ? props.row.profilePhoto : require('src/assets/default_profile.jpg')"></q-img>
            </q-avatar>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn dense color="primary" @click="showUserDialog(props.row)" icon="edit"/>
              <q-btn dense color="red" icon="delete"/>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="userDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px" class="column">
      <q-form ref="userForm">
        <q-card-section>
          <div class="text-h6">{{(isUpdatingUser) ? 'Update' : 'Add'}} User</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-item>
            <q-input
              outlined
              color="primary"
              for="fullName"
              lazy-rules="lazy-rules"
              name="fullName"
              label="Full Name"
              value=""
              style="width: 100%"
              v-model="currentUser.fullName"
              :rules="[val => !!val || '*Field is required']"
            />
          </q-item>
          <q-item>
            <q-input
              outlined
              color="primary"
              for="mobile"
              lazy-rules="lazy-rules"
              name="mobile"
              label="Mobile"
              value=""
              style="width: 100%"
              v-model="currentUser.mobile"
              hint="+63(###) ###-####" 
              mask="+##(###) ###-####"
            />
          </q-item>
          <q-item>
            <q-select 
              outlined
              color="primary"
              for="role"
              lazy-rules="lazy-rules"
              name="role"
              label="Role"
              style="width: 100%"
              :options="['Admin', 'Customer']"
              v-model="currentUser.role"
              :rules="[val => !!val || '*Field is required']"
            />
          </q-item>
          <q-item>
            <q-select 
              outlined
              color="primary"
              for="branchName"
              lazy-rules="lazy-rules"
              name="branchName"
              label="Branch"
              style="width: 100%"
              :options="['Cavite', 'Bulacan']"
              v-model="currentUser.branchName"
              :rules="[val => !!val || '*Field is required']"
            />
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCEL" color="primary" v-close-popup />
          <q-btn flat label="OK" @click="saveUser"/>
        </q-card-actions>
      </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</q-pull-to-refresh>
</template>

<script>
import {exportFile} from "quasar"
import { mapGetters, mapActions } from 'vuex'

function wrapCsvValue(val, formatFn) {
    let formatted = formatFn !== void 0 ? formatFn(val) : val

    formatted =
        formatted === void 0 || formatted === null ? "" : String(formatted)

    formatted = formatted.split('"').join('""')

    return `"${formatted}"`
}

export default {
  data() {
    return {
      filter: "",
      customer: {},
      new_customer: false,
      mode: "list",
      columns: [
        {
          name: "profile_photo",
          required: true,
          label: "",
          align: "center",
          field: "profilePhoto",
          sortable: false
        },
        {
          name: "full_name",
          required: true,
          label: "Full Name",
          align: "left",
          field: "fullName",
          sortable: true
        },
        {
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
          sortable: true
        },
        {
          name: "mobile",
          align: "left",
          label: "Mobile",
          field: "mobile",
          sortable: true
        },
        {
          name: "role",
          align: "left",
          label: "Role",
          field: "role",
          sortable: true
        },
        {
          name: "branch",
          align: "left",
          label: "Branch",
          field: "branchName",
          sortable: true
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
      userDialog: false,
      currentUser: {}
    }
  },
  computed: {
    ...mapGetters('user', ['allUsers']),
    isUpdatingUser(){
      return (this.currentUser.id) ? true: false
    }
  },
  methods: {
    ...mapActions('user', ['getAllUsers', 'updateUserData']),
    async refresh(done) {
      await this.getAllUsers()
      done()
    },
    showUserDialog(user){
      this.userDialog = true
      this.currentUser= (user) ? {...user} : {}
    },
    async saveUser(){
      this.$q.loading.show({
        message: (this.isUpdatingUser) ? 'Updating': 'Creating' + ' user, please stand by...',
        customClass: 'text-h3, text-bold'
      })
      try {
        if (this.isUpdatingUser) {
          await this.updateUserData(this.currentUser)
        } else {
          // await this.addProductCategory(this.currentProductCategory)
        }
        
        let typeLabel = (this.isUpdatingUser) ? "updated" : "added"
        this.$q.notify({
          message: this.currentUser.email + ' has been ' + typeLabel + '.',
          type: 'positive',
          actions: [
            { label: 'Dismiss', color: 'white' }
          ]
        })
        this.userDialog = false
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem ${(this.isUpdatingUser) ? 'Updating': 'Creating'} the user: ${err}`,
          color: 'negative'
        })
      } finally {
        this.$q.loading.hide()
      }
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
        .join("\r\n")

      const status = exportFile("customer-management.csv", content, "text/csv")

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        })
      }
    }
  }
}
</script>
