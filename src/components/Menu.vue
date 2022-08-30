<template>
  <v-list dense>
    <template>
      <v-list dense>
        <template>
          <div v-for="item in items" :key="item.title">
            <v-list-group
              v-if="item.items"
              v-model="item.active"
              :prepend-icon="item.action"
              no-action
              link
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="subItem in item.items"
                :key="subItem.title"
                :to="subItem.to"
              >
                <v-list-item-icon>
                  <v-icon v-text="subItem.action"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-item v-else :to="item.to" link>
              <v-list-item-icon>
                <v-icon v-text="item.action"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
      </v-list>
    </template>
  </v-list>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      items: [
        {
          action: "payments",
          title: "Pagos",
          to: "/register-paid",
        },
        {
          action: "paid",
          title: "Mis Cobros",
          to: "/create-payment",
        },
        {
          action: "edit_attributes",
          title: "Modificaciones",
          items: [
            {
              title: "Pagos",
              action: "edit_attributes",
              to: "/edit-paids",
            },
            {
              title: "Creditos",
              action: "edit_attributes",
              to: "/edit-credits",
            },
          ],
        },
        {
          action: "auto_awesome_motion",
          title: "Informes",
          items: [
            {
              title: "Estado Actual",
              action: "auto_awesome_motion",
              to: "/actual-state",
            },{
              title: "Creditos Vencidos",
              action: "auto_awesome_motion",
              to: "/credits-expired",
            },
          ],
        },
        {
          action: "assessment",
          title: "Estadisticas",
          items: [
            {
              title: "Grafica Actual",
              action: "assessment",
              to: "/graphic-state",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped></style>
