<template>
  <v-navigation-drawer app dark class="primary" v-model="drawer">
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="title">
                            <span class="font-weight-bold">Al-Mehmood</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>Transport Company</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-group no-action v-for='navLink in navLinks' :key="navLink.text">
                    <v-list-item slot='activator' :to="navLink.route">
                        <v-list-item-icon>
                            <v-icon>{{ navLink.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ navLink.text }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-for='sub in navLink.subLinks' :key="sub.text">
                        <v-list-item-title :to="sub.route">{{ sub.text }}</v-list-item-title>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      drawer: true,
    
            navLinks: [
                { icon: "dashboard", text: "Dashboard", route: "/" },
                { icon: "star", text: "Ratings", route: "/ratings" },
                {
                    icon: "people",
                    text: "Drivers",
                    route: "/drivers",
                    subLinks: [
                        { text: "Add Driver", route: "/drivers/add" },
                        { text: "Add Driver", route: "/drivers/add" }
                    ]
                },
    
                {
                    icon: "person_outline",
                    text: "Manager",
                    route: "/managers",
                    subLinks: [
                        { text: "Add Manager", route: "/managers/add" },
                        { text: "Managers", route: "/managers" }
                    ]
                },
                { icon: "person", text: "Manage Users", route: "/users" }
            ]
    };
  },
};
</script>

<style scoped>
 
</style>