<template>
  <Table
    :pagination="false"
    :columns="columns"
    :data-source="delegates"
    row-key="name"
    :scroll="{ y: isMobile() ? 480 : 740 }"
  >
    <!-- Ant Table's cell slots, for custom design -->
    <div slot="name" slot-scope="text, record">
      <Tooltip title="Click to learn more">
        <span class="text-red-600 font-bold"> {{ record.rank }}. </span>
        <a
          class="font-bold text-blue-600"
          target="_blank"
          :href="'https://arkdelegates.live/delegate/' + record.slug"
        >
          {{ text }}
        </a>
      </Tooltip>

      <div class="hidden md:block">
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
    <div
      slot="minPayout"
      slot-scope="text, record"
      class="font-bold flex flex-col"
    >
      {{ text }}h
      <span class="font-bold">
        {{ calculateMinPayout(record.payout_minimum)
        }}<span class="text-red-600"> Ѧ</span>
      </span>
    </div>
  </Table>
</template>

<script>
import { Table, Tooltip } from "ant-design-vue";

const columns = [
  {
    key: "name",
    dataIndex: "name",
    title: "Name",
    sorter: (a, b) => a.rank - b.rank,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Daily Reward",
    dataIndex: "daily",
    key: "daily",
    sorter: (a, b) => a.daily - b.daily,
    scopedSlots: { customRender: "daily" },
  },
  {
    key: "weekly",
    title: "Weekly Reward",
    dataIndex: "weekly",
    sorter: (a, b) => a.weekly > b.weekly,
    scopedSlots: { customRender: "weekly" },
  },
  {
    key: "payout_percent",
    title: "Shares",
    dataIndex: "payout_percent",
    sorter: (a, b) => a.payout_percent - b.payout_percent,
    scopedSlots: { customRender: "share" },
  },
  {
    key: "payout_interval",
    title: "Payout Interval",
    dataIndex: "payout_interval",
    sorter: (a, b) => a.payout_interval - b.payout_interval,
    scopedSlots: { customRender: "minPayout" },
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
      everydayArk: 422,
      arktoshiRate: 100000000,
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
          const shares = (this.everydayArk * delegate.payout_percent) / 100;
          const votingRate =
            parseInt(delegate.delegateStatistics.voting_power) /
            this.arktoshiRate;

          delegate.daily =
            shares / ((votingRate + (isVoted ? 0 : balance)) / balance);
          delegate.weekly = delegate.daily * 7;
        }
      });
    },
    calculateMinPayout(minPayout) {
      if (minPayout == null || minPayout == 0) {
        return 0;
      } else {
        return (parseInt(minPayout) / this.arktoshiRate).toFixed(2);
      }
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style></style>
