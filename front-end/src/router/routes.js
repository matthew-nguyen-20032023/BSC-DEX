// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";
import TradingLayout from "@/layout/trading/TradingLayout";

const routes = [
  {
    path: "/",
    component: TradingLayout,
    children: [
    ]
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
