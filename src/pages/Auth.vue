<template>
  <!-- <q-page padding style="padding:100px 0"> -->
  <q-page padding v-bind:style="$q.screen.lt.sm?{'padding-left': '25px', 'padding-right': '25px'}:{'padding':'none'}">
    
    <div class="text-center">
      <img  style="max-width:200px" :src="require('src/assets/PlantTeaTaLogo.png')"/>
    </div>
    <q-form class="authentication q-gutter-y-md" ref="emailAuthenticationForm" @submit="onSubmit">
      <q-item class="q-pa-sm q-ma-none">
        <q-item-section>
            <div class="text-left text-bold text-h4">{{ getAuthType }}</div>
        </q-item-section>
        <q-item-section side>
              <router-link :to="routeAuthentication">
                <span @click="reset" v-if="isRegistration">Login</span>
                <span @click="reset" v-else>Register</span>
              </router-link>
        </q-item-section>
      </q-item>
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
      <p class="q-ma-none text-right">
          <router-link class="text-blue" to="forgotPassword">Forgot Password?</router-link>
      </p>
      <q-btn
        class="full-width q-mt-md q-pa-sm"
        color="secondary"
        data-cy="submit"
        type="submit"
        :label="getAuthType" />
      
      <div class="text-center">OR</div>
      <q-btn @click="facebookSignin" class="full-width q-mt-md q-pa-sm" color="blue-10" icon="fab fa-facebook-f" label="Login with Facebook" />
      <!-- <q-btn class="full-width q-mt-md" color="red-8" icon="fab fa-google" label="Login with Google" /> -->
      <!-- <q-btn class="full-width q-mt-md" color="purple-6" icon="fas fa-mobile-alt" label="Login with Phone" /> -->
    </q-form>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { QSpinnerGears } from 'quasar'
import firebase from 'firebase/app';

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
    ...mapActions('auth', ['createNewUserWithEmail', 'loginUser', 'createNewUser']),
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
                await this.createNewUserWithEmail({ email, password, fullName })
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
    },
    facebookSignin(){
      var provider = new firebase.auth.FacebookAuthProvider()
      provider.addScope('public_profile')
      firebase.auth().useDeviceLanguage();
      provider.setCustomParameters({
        'display': 'popup'
      });
      firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        if(user){
          this.$router.push('/')
        }

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
    }
  },
  mounted() {
    // const self = this
    // var provider = new firebase.auth.FacebookAuthProvider()
    // provider.addScope('user_birthday')
    // firebase.auth().useDeviceLanguage();
    // provider.setCustomParameters({
    //   'display': 'popup'
    // });
    // console.log(provider);
    // var uiConfig = {
    //   signInSuccessUrl: '/',
    //   signInOptions: [
    //         {
    //             provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    //             recaptchaParameters: {
    //                 size: 'invisible',
    //                 badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
    //             },
    //             defaultCountry: 'PH',
    //             loginHint: '+63'
    //         },
    //         //firebase.auth.TwitterAuthProvider.PROVIDER_ID, // Twitter does not support scopes.
    //         firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //         firebase.auth.EmailAuthProvider.PROVIDER_ID, // Other providers don't need to be given as object.
    //         firebase.auth.GoogleAuthProvider.PROVIDER_ID
    //     ],
    //     'credentialHelper': firebaseui.auth.CredentialHelper.NONE
    //   };
    //   let ui = firebaseui.auth.AuthUI.getInstance();
    //   if (!ui) {
    //     ui = new firebaseui.auth.AuthUI(firebase.auth());
    //   }
    //   ui.start('#firebaseui-auth-container', uiConfig);
  }
}
</script>

<style lang="stylus">
.authentication
  margin auto
  max-width 30em
  width 100%
</style>