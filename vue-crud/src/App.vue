<script setup>
import { RouterView } from 'vue-router'

</script>

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          MiniStore
        </q-toolbar-title>
        <q-tabs align="left">
        <q-route-tab to="/" label="Customer" />
        <q-route-tab to="/product" label="Products" />
        <q-route-tab to="/orders" label="Orders" />
        <q-route-tab to="/about" label="about" />
  
      </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

