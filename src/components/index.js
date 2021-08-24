import Vue from 'vue'

import DynamicTable from './DynamicTable'
import EOSTag from "./EOSTag";
import E0SComboGrid from "@/components/E0SComboGrid";

Vue.component("eos-tag", EOSTag);
Vue.component("eos-combo-grid", E0SComboGrid);
Vue.component('eos-dynamic-table', DynamicTable)
