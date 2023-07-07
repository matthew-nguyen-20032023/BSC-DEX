<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <Notifications/>
      <b-card
          no-body
          style="max-width: 20rem; margin: 0 auto; margin-top: 15%"
          :img-src="image"
          img-alt="Image"
          img-top
      >
        <hr>
        <b-card-body>
          <b-button-group>
            <b-button variant="outline-info" @click="randomImage()">New Image</b-button>
            <b-button variant="outline-success" @click="chooseThisImage()">Choose This Image</b-button>
          </b-button-group>
        </b-card-body>
      </b-card>
    </div>
  </Transition>
</template>

<script>

import {randomImage} from "@/services";

export default {
  props: {
    show: Boolean,
  },
  created() {
  },
  watch: {
    show(newVal) {
      if (newVal) this.randomImage();
    }
  },
  data() {
    return {
      image: ''
    };
  },
  methods: {
    chooseThisImage: function () {
      this.$emit('ipfsUpdated', this.image);
    },
    randomImage: function () {
      randomImage()
          .then(response => {
            this.$notify({
              title: 'Random Image',
              text: 'Success',
              type: 'success'
            });
            this.image = response.data.message;
          })
          .catch(error => {
            this.$notify({
              title: 'Randome Image',
              text: error.response.data.message,
              type: 'warn'
            });
          })
    },
  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  border-radius: 20px;
  width: 40%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #0D6efd;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>