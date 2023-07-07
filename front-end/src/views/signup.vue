<template>
  <div class="box">
    <notifications />
    <b-badge variant="info"><H1>Register Form</H1></b-badge>

    <b-form-input class="mb-3" v-model="email" placeholder="Enter your email"></b-form-input>

    <b-form-input class="mb-3" v-model="password" type="password" placeholder="Enter your password"></b-form-input>

    <b-form-select class="mb-3" v-model="role" :options="roleOptions"></b-form-select>

    <b-button class="btn-success" @click="register()">Submit</b-button>

    <span>Have an account? <a href="/">Login</a> </span>
  </div>

</template>

<script>
// @ is an alias to /src

import {serviceRegister} from "@/services";

export default {

  data() {
    return {
      roleOptions: [
        { value: 'admin', text: 'admin' },
        { value: 'client', text: 'client' },
      ],
      role: "admin",
      password:"",
      userLoggedIn: false,
      email:"",
      mail:"",
      isActive: false,
    };
  },
  toggle() {
    this.isActive = ! this.enable ;
  },
  methods: {
    register: function () {
      serviceRegister(this.email, this.password, this.role)
      .then(response => {
        this.$notify({
          title: 'Register',
          text: response.data.message,
          type: 'success'
        });
        window.location.href = '/';
      })
      .catch(error => {
        this.$notify({
          title: 'Register',
          text: error.response.data.message,
          type: 'warn'
        });
      })
    }
  }
};
</script>

