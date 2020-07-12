import "core-js/stable";
import "regenerator-runtime/runtime";
import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import "./plugins";
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/bar';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
// import 'echarts/lib/component/tooltip';
// import "echarts/lib/chart/line";
// import "echarts/lib/chart/pie";
// import "echarts/lib/component/legend";
// import "echarts/lib/component/markPoint";
// import "echarts/lib/component/markLine";
// import "echarts/lib/component/graphic";
// If you want to use ECharts extensions, just import the extension package and it will work
// Taking ECharts-GL as an example:
// You only need to install the package with `npm install --save echarts-gl` and import it as follows
// import 'echarts-gl'
Vue.component('v-chart', ECharts);
Vue.config.productionTip = false;

new Vue({
    el: "#vue-admin-beautiful",
    router,
    store,
    render: (h) => h(App),
});