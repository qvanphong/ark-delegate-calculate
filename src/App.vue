<template>
  <div id="app" class="flex flex-col items-center">
    <div class="sm:w-full md:w-2/4 h-full">
      <div class="flex items-start py-4">
        <img
          style="width: auto; height: 48px"
          src="https://ark.io/images/logo.svg"
        />
        <div class="ml-4">
          <h2 class="text-xl font-bold">ARK Delegate Calculator</h2>
          <Button type="link" size="small" class="p-0" @click="openHowToUse">
            How to use?
          </Button>
        </div>
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
          <Tooltip title="If you already voted for this delegate, check this.">
            <span class="font-bold">Voted</span>
          </Tooltip>
        </Checkbox>
      </div>
      <delegate-table
        class=""
        :balance="balance"
        :voted="isVoted"
      ></delegate-table>
    </div>

    <!-- How to use modal -->
    <Modal
      v-model="modalVisible"
      title="How to use?"
      :width="720"
      :cancel-button-props="{ style: { display: 'none' } }"
      @ok="hideHowToUse"
    >
      <div>
        <span class="font-bold">Step 1.</span>
        <span>Input your ARK balance into the <b>input field</b> below:</span>
        <img src="/img/tutorial_1.png" />
        <span
          >If you already voted for the delegate you are looking for, check the
          <b>"Voted"</b> checkbox</span
        >
        <br />
        <br />
        <span class="mt-2 font-bold">Step 2.</span>
        <span
          >The app will calculate the profit you earn everyday and show in the
          big table. Now you will have to make a decide which delegate you
          should vote for yourself.
        </span>
        <img src="/img/tutorial_2.png" />
        <br />
        <br />
        <span class="mt-2 font-bold">Some tips you may need to know</span>
        <ul class="list-disc">
          <li>
            If you want to sort the data, just click on the table heading.
          </li>
          <li>
            If you already voted for the delegate you are looking for, check the
            Voted check box, that will help calculate more accuracy.
          </li>
          <li>
            Some delegate show 0% share, most of them have private deal for
            daily payout, you have to find out yourself.
          </li>
          <li>
            You can learn more about delegate by click on delegate name. (Highly
            recommend learn about delegate)
          </li>
          <li>The red number next to the delegate name is ranking.</li>
          <li>
            Be careful! There is 1 more thing to decide when you will receive
            your daily payout, that is <b>minimum payout</b>(in the payout
            interval), your reward must meets the minimum payout that delegate
            require. <br />(For example: Everyday you get 0.005 ark from
            delegate, but their minimum payout is 0.01, which mean you will
            receive your payout every 2 days.)
          </li>
          <li>
            Feel free to fork or send an issue on
            <a
              class="underline"
              href="https://github.com/qvanphong/ark-delegate-calculate"
              >Github</a
            >
          </li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script>
import { InputNumber, Tooltip, Checkbox, Button, Modal } from "ant-design-vue";
import DelegateTable from "./components/DelegateTable.vue";
import debounce from "debounce";

export default {
  name: "App",
  components: {
    DelegateTable,
    InputNumber,
    Checkbox,
    Tooltip,
    Button,
    Modal,
  },
  data() {
    return {
      balance: null,
      debounceInput: null,
      isVoted: false,
      modalVisible: false,
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
    openHowToUse() {
      this.modalVisible = true;
    },
    hideHowToUse() {
      this.modalVisible = false;
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
