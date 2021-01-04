<!-- ⭐ Write an interactive DEMO of your chart in this component.
Follow the notes below! -->
<script>
  export let responsive; // eslint-disable-line
  import { afterUpdate } from 'svelte';
  import AutoDoc from './AutoDoc.svelte';
  import TestingDots from '../js';
  import testData from './tests.json'
  import caseData from './cases.json'
  let chartContainer;

  // 💪 Create a new chart instance of your module.
  let chart = new TestingDots();

  // 🎚️ Create variables for any data or props you want users to be able
  // to update in the demo. (And write buttons to update them below!)

  let chartData = {
    cases: caseData.cases,
    tests: testData.testingData.test_dailycount,
  }

  let circleFill = 'steelblue';
  // ...

  // 🎈 Tie your custom props back together into one chartProps object.
  $: chartProps = { fill: circleFill };

  afterUpdate(() => {
    // ⚡ Finally, let's use your chart!
    chart
      .selection(chartContainer)
      .data(chartData) // Pass your chartData
      .props(chartProps) // Pass your chartProps
      .draw(); // 🚀 DRAW IT!
  });

</script>

<!-- 🖌️ Style your demo page here -->
<style lang="scss">
  .chart-options {
    button {
      padding: 5px 15px;
    }
  }
</style>

<div id="chart" bind:this={chartContainer} />

<div class="chart-options">
  <!-- ✏️ Create buttons that update your data/props variables when they're clicked! -->
  <button
    on:click={() => {
      chartData = getRandomData();
    }}>New data</button>
  <button
    on:click={() => {
      circleFill = circleFill === 'orange' ? 'steelblue' : 'orange';
    }}>Change fill</button>
</div>

<!-- ⚙️ This component will automatically create interactive documentation
for you chart that will update as a user plays with the custom props you
provided for above! -->
<AutoDoc {chartProps} {chart} />
