<template>
  <Table
    :pagination="false"
    :columns="columns"
    :data-source="delegates"
    row-key="name"
    :scroll="{ y: 740 }"
  >
    <div slot="name" slot-scope="text, record">
      <a
        class="font-bold"
        target="_blank"
        :href="'https://arkdelegates.live/delegate/' + record.slug"
      >
        {{ text }}
      </a>
      <div>
        <Tooltip
          :title="
            'This is a ' +
            (record.is_private ? 'private' : 'public') +
            ' delegate.'
          "
        >
          <span class="text-gray-500 pr-2 font-bold text-xs">{{
            record.is_private ? "Private" : "Public"
          }}</span>
        </Tooltip>
        <Tooltip title="Contribute status">
          <span class="text-gray-500 border-l-2 pl-2 font-bold text-xs">{{
            record.contribution_status
          }}</span>
        </Tooltip>
      </div>
    </div>
    <span slot="daily" slot-scope="text" class="font-bold">
      {{ text.toFixed(2) }} <span class="text-red-600">Ѧ</span></span
    >
    <span slot="weekly" slot-scope="text" class="font-bold">
      {{ text.toFixed(2) }} <span class="text-red-600">Ѧ</span></span
    >
    <span slot="share" slot-scope="text" class="font-bold"> {{ text }}% </span>
    <span slot="payout" slot-scope="text" class="font-bold"> {{ text }}h </span>
  </Table>
</template>

<script>
import { Table } from "ant-design-vue";
import { Tooltip } from "ant-design-vue";

const columns = [
  {
    key: "name",
    dataIndex: "name",
    title: "Name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Daily Reward",
    dataIndex: "daily",
    key: "daily",
    scopedSlots: { customRender: "daily" },
  },
  {
    key: "weekly",
    title: "Weekly Reward",
    dataIndex: "weekly",
    scopedSlots: { customRender: "weekly" },
  },
  {
    key: "payout_percent",
    title: "Shares",
    dataIndex: "payout_percent",
    scopedSlots: { customRender: "share" },
  },
  {
    key: "payout_interval",
    title: "Payout Interval",
    dataIndex: "payout_interval",
    scopedSlots: { customRender: "payout" },
  },
];

export default {
  name: "DelegateTable",

  components: { Table, Tooltip },
  props: {
    balance: {
      type: Number,
      default: 0,
    },
    voted: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      columns,
      delegates: null,
    };
  },

  watch: {
    balance(newVal) {
      this.calculate(newVal, this.isVoted);
    },
    voted(newVal) {
      console.log(newVal);
      this.calculate(this.balance, newVal);
    },
  },

  async mounted() {
    const delegates = await this.$store.dispatch("getTopDelegate");
    delegates.map((delegate) => {
      delegate.daily = 0;
      delegate.weekly = 0;
    });
    this.delegates = delegates;
  },

  methods: {
    calculate(balance, isVoted) {
      const everydayArk = 422;
      const arktoshiRate = 100000000;

      this.delegates.map((delegate) => {
        if (
          delegate.payout_percent == 0 ||
          delegate.payout_percent == null ||
          delegate.delegateStatistics.voting_power == 0 ||
          delegate.delegateStatistics.voting_power == null
        ) {
          delegate.daily = 0;
          delegate.weekly = 0;
        } else {
          const shares = (everydayArk * delegate.payout_percent) / 100;
          const votingRate =
            parseInt(delegate.delegateStatistics.voting_power) / arktoshiRate;

          delegate.daily =
            shares / ((votingRate + (isVoted ? 0 : balance)) / balance);
          delegate.weekly = delegate.daily * 7;
        }
      });
    },
  },
};
</script>

<style></style>
