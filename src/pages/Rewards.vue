<template>
<q-pull-to-refresh @refresh="refresh" color="primary">
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm  q-py-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card dark bordered class="bg-red" v-if="!isEmailVerified">
            <q-item>
                <q-item-section>
                    <q-item-label>Your email hasn't been verified yet</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-btn color="white" flat label="VERIFY NOW" @click="verifyEmail"/>
                </q-item-section>
            </q-item>
        </q-card>
        <q-item class="q-ma-lg">
            <q-item-section class="items-center">
                <q-item-label class="text-h1 text-bold">{{currentUserPoints}}</q-item-label>
                <q-item-label>Plant Teta-ta Points</q-item-label>
            </q-item-section>
        </q-item>
        <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        >
            <q-tab name="offers" :class="tab=='offers'?'text-blue':''" icon="local_fire_department" label="Offers"/>
            <q-tab name="history" :class="tab=='history'?'text-blue':''" icon="history" label="History"/>
            <q-tab name="mycard" :class="tab=='mycard'?'text-blue':''" icon="qr_code" label="QR Code"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="offers">
                <q-list class="rounded-borders">
                    <q-card class="q-mb-sm my-card">
                        <q-item>
                            <q-item-section>
                                <q-item-label class="text-bold" lines="1">Earn 1 point per 10php Milk Tea spend</q-item-label>
                                <q-item-label caption lines="2">
                                <span class="text-weight-bold">No Expiration</span>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <a>Read More</a>
                            </q-item-section>
                        </q-item>
                    </q-card>
                    
                    <q-card class="q-mb-sm my-card">
                        <q-item>
                            <q-item-section>
                                <q-item-label class="text-bold" lines="1">FREE 20pts : Facebook Share Promo</q-item-label>
                                <q-item-label caption lines="2">
                                <span class="text-weight-bold">Valid Until Feb 28, 2021</span>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <a>Read More</a>
                            </q-item-section>
                        </q-item>
                    </q-card>
                </q-list>
            </q-tab-panel>
            <q-tab-panel name="history">
                <q-list class="rounded-borders" separator>
                    <q-item v-for="(transaction, index) in currentUserRewardTransactions" :key="index">
                        <q-item-section>
                            <q-item-label lines="1">{{formatDate(transaction.createdDate.toDate())}}</q-item-label>
                            <q-item-label caption lines="2">
                            <span class="text-weight-bold">{{transaction.description}}</span>
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side class="text-h5" :style="(transaction.transactionType == 'Debit')?'color:green;':'color:red;'">
                            <q-item-label>{{(transaction.transactionType == 'Debit')?'+':'-'}}{{transaction.points}}</q-item-label>
                            <q-item-label caption lines="2">
                                <span class="text-weight-bold">Balance: {{transaction.runningBalance}}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-tab-panel>
            <q-tab-panel name="mycard">
                <div class="q-pa-sm row justify-center items-center">
                    <q-item>
                        <q-card>
                            <q-card-section>
                                <img :src="QRCodeLink"/>
                            </q-card-section>
                        </q-card>
                    </q-item>
                    <q-item>
                        <q-item-label>Present this code on payment to earn points</q-item-label>
                    </q-item>
                </div>
            </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</q-pull-to-refresh>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { date } from 'quasar'
export default {
    name: "Rewards",
    data() {
        return {
            tab: 'offers',
        }
    },
    mounted: async function(){
        await this.getCurrentUserRewardTransactions()
    },
    computed: {
        ...mapGetters('user', ['currentUser', 'currentUserRewardTransactions']),
        currentUserPoints() {
            return (this.currentUser && this.currentUser.points) ? this.currentUser.points: 0
        },
        QRCodeLink() {
            const currentUserId = this.$store.state.auth.uid
            if(currentUserId){
                return 'https://chart.apis.google.com/chart?cht=qr&chs=200x200&chld=H|0&chl=' + currentUserId
            }
            else {
                return ''
            }
        },
        milkTeaCategories() {
            return this.productCategories.filter(c => ['Classic', 'Premium', 'Supreme'].some(n => n == c.categoryName))
        },
        isEmailVerified() {
            return this.$store.state.auth.isEmailVerified
        }
    },
    methods: {
        ...mapActions('user', ['getCurrentUserRewardTransactions']),
        async refresh(done) {
            await this.getCurrentUserRewardTransactions()
            done()
        },
        formatDate(value){
            const phTimeDate = this.$options.filters.toPHTimezone(value)
            return date.formatDate(phTimeDate, 'ddd MMM DD YYYY hh:mm A')
        },
        verifyEmail(){
            this.$fb.auth().onAuthStateChanged(function(user) {
                if ((user) && !user.emailVerified) {
                    var actionCodeSettings = {
                        url: '',
                        handleCodeInApp: true,
                    };
                    user.sendEmailVerification().then(function() {
                    // Email sent.
                    }).catch(function(error) {
                    // An error happened.
                    });
                }
            });
        }
    }
}
</script>

<style lang="sass" scoped>
.my-card
  border-left: 3px solid teal
</style>