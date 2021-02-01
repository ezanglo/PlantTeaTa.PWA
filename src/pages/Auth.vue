<template>
  <!-- <q-page padding style="padding:100px 0"> -->
  <q-page padding v-bind:style="$q.screen.lt.sm?{'padding-left': '25px', 'padding-right': '25px'}:{'padding':'none'}">
    
    <div class="text-center">
      <img  style="max-width:250px" :src="require('src/assets/PlantTeaTaLogo.png')"/>
    </div>
    <h5 class="text-center">{{ getAuthType }} to Plant Tea-ta!</h5>
    <q-form class="authentication q-gutter-y-md" ref="emailAuthenticationForm" @submit="onSubmit">
      <q-input
        v-if="isRegistration"
        v-model="fullName"
        outlined
        color="primary"
        data-cy="fullName"
        for="fullName"
        name="fullName"
        label="FULL NAME"
        type="text"
        :rules="[val => !!val || '*Field is required']"
      />
      <q-input
        v-model="email"
        outlined
        autocomplete="email"
        color="primary"
        data-cy="email"
        for="email"
        lazy-rules="lazy-rules"
        name="email"
        label="EMAIL"
        type="email"
        :rules="[val => !!val || '*Field is required', val => val.includes('@') && val.includes('.') || '*Please Provide a valid email']"
      />
      <q-input
        v-model="password"
        for="password"
        name="password"
        lazy-rules="lazy-rules"
        outlined
        autocomplete="current-password"
        color="primary"
        data-cy="password"
        label="PASSWORD"
        :rules="[val => !!val || '*Field is required']"
        :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit();"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-input
        v-if="isRegistration"
        lazy-rules="lazy-rules"
        outlined
        autocomplete="new-password"
        color="primary"
        data-cy="verifyPassword"
        label="VERIFY PASSWORD"
        v-model="passwordMatch"
        :rules="[val => !!val || '*Field is required', val => val === password || '*Passwords don\'t match']"
        :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit();"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-btn
        class="full-width q-mt-md"
        color="primary"
        data-cy="submit"
        type="submit"
        :label="getAuthType"
      >
      </q-btn>

      <p class="q-mt-md q-mb-none text-center">
          <router-link class="text-blue" :to="routeAuthentication">
            <span @click="reset" v-if="isRegistration">Need to login?</span>
            <span @click="reset" v-else>Need to create an account?</span>
          </router-link>
      </p>
      <p class="q-ma-sm text-center">
          <router-link class="text-blue" to="forgotPassword">Forgot Password?</router-link>
      </p>
    </q-form>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { QSpinnerGears } from 'quasar'
export default {
  name: 'Auth',
  computed: {
    getAuthType () {
      return this.isRegistration ? 'Register' : 'Login'
    },
    isRegistration () {
      return this.$route.name === 'Register'
    },
    routeAuthentication () {
      return this.isRegistration ? '/auth/login' : '/auth/register'
    }
  },
  data () {
    return {
      fullName: null,
      email: null,
      isPwd: true,
      password: null,
      passwordMatch: null
    }
  },
  methods: {
    ...mapActions('auth', ['createNewUser', 'loginUser']),
    onSubmit () {
      const { fullName, email, password } = this
      this.$refs.emailAuthenticationForm.validate()
        .then(async success => {
          if (success) {
            this.$q.loading.show({
              message: this.isRegistration
                ? 'Registering your account...'
                : 'Authenticating your account...',
              backgroundColor: 'grey',
              spinner: QSpinnerGears,
              customClass: 'loader'
            })
            try {
              if (this.isRegistration) {
                await this.createNewUser({ email, password, fullName })
              } else {
                await this.loginUser({ email, password })
              }
              this.$router.push({ path: '/' })
            } catch (err) {
              console.error(err)
              this.$q.notify({
                message: `An error as occured: ${err}`,
                color: 'negative'
              })
            } finally {
              this.$q.loading.hide()
            }
          }
        })
    },
    reset() {
      this.$refs.emailAuthenticationForm.resetValidation()
    }
  }
}
</script>

<style lang="stylus">
.authentication
  margin auto
  max-width 30em
  width 100%
</style>