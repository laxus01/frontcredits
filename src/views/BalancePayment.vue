.<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
        >Balance Diario </v-banner
      >
      <SaveBalance />
    </v-card>
  </v-container>
</template>

<script>
import SaveBalance from "../components/SaveBalance.vue";

export default {
    
  components: {
    SaveBalance,
  },

}
</script>

<style>

</style>