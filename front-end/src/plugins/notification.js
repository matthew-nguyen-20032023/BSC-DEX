import Vue from "vue/dist/vue.js";

export const notificationApp = (caller, template) => {
  caller.$notify({
    component: template,
    icon: "tim-icons icon-bell-55",
    horizontalAlign: "center",
    verticalAlign: "top",
    type: "warning",
    timeout: 3000,
  });
};

export const notificationWithCustomMessage = (type, caller, message) => {
  const customComponent = Vue.component("custom-component", {
    template: `
      <div><b>Backend</b> ${message} </div>
  `,
  });
  caller.$notify({
    component: customComponent,
    icon: "tim-icons icon-bell-55",
    horizontalAlign: "center",
    verticalAlign: "top",
    type,
    timeout: 3000,
  });
};
