<template>
  <div id="app" class="flex flex-col items-center">
    <div class="sm:w-full md:w-2/4 h-full">
      <div class="flex items-center py-4">
        <img
          style="width: auto; height: 38px"
          src="https://ark.io/images/logo.svg"
        />
        <h2 class="text-xl font-bold ml-4">ARK Delegate Calculator</h2>
      </div>
      <div class="mb-4 flex flex-row items-center">
        <InputNumber
          v-model="debounceInput"
          placeholder="Input your ARK balance here"
          enter-button="Search"
          size="large"
          suffix="Ѧ"
          style="flex: 0.8"
        />
        <Checkbox class="ml-8" style="flex: 0.2" @change="onVotedChange">
          <span class="font-bold">Voted</span>
        </Checkbox>
      </div>
      <delegate-table
        class=""
        :balance="balance"
        :voted="isVoted"
      ></delegate-table>
    </div>
  </div>
</template>

<script>
import { InputNumber } from "ant-design-vue";
import { Checkbox } from "ant-design-vue";
import DelegateTable from "./components/DelegateTable.vue";
import debounce from "debounce";

export default {
  name: "App",
  components: {
    DelegateTable,
    InputNumber,
    Checkbox,
  },
  data() {
    return {
      balance: null,
      debounceInput: null,
      isVoted: false,
    };
  },
  watch: {
    debounceInput: debounce(function (e) {
      if (e == null || e == "") this.balance = 0;
      else this.balance = e;
    }, 350),
  },
  methods: {
    onVotedChange(e) {
      this.isVoted = e.target.checked;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.ant-input-suffix {
  font-weight: bold;
  color: red !important;
}
</style>
