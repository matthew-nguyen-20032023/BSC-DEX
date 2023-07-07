<template>
  <div class="box">
    <notifications />
    <b-badge variant="info"><H1>Login Form</H1></b-badge>

    <b-form-input class="mb-3" v-model="email" placeholder="Enter your email"></b-form-input>
    <b-form-input class="mb-3" v-model="password" type="password" placeholder="Enter your password"></b-form-input>

    <b-button variant="success" @click="login()">Submit</b-button>

    <span>Doesn't have account?, please <a href="/signup">signup</a> </span>
  </div>

</template>

<script>
import {serviceLogin} from "@/services";

export default {
  data() {
    return {
      email: "exampleEmail@gmail.com",
      password: "examplePassword@123",
      userLoggedIn: false,
      isActive: false,
    };
  },toggle() {
    this.isActive = ! this.enable ;
  },
  methods: {
    login: async function() {
      serviceLogin(this.email, this.password)
      .then(response => {
        this.$notify({
          title: 'Login',
          text: response.data.message,
          type: 'success'
        });
        this.userLoggedIn = true;
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('role', response.data.data.role);
        localStorage.setItem('userId', response.data.data.userId);
        if (response.data.data.role === "admin") window.location.href = "/admin";
        else window.location.href = "/user";
      })
      .catch(error => {
        this.$notify({
          title: 'Login',
          text: error.response.data.message,
          type: 'warn'
        });
      })
    }
  }
};
</script>
