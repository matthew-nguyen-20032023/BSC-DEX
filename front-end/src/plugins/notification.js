export const notificationApp = (caller, template) => {
  caller.$notify({
    component: template,
    icon: "tim-icons icon-bell-55",
    horizontalAlign: "center",
    verticalAlign: "top",
    type: "warning",
    timeout: 3000
  });
}
