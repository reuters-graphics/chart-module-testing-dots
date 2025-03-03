<!-- ✋ You can safely ignore this component...
  
... unless you want to customize the automatic documentation
for your chart. In which case, follow the notes below! -->

<style lang="scss">
  div.chart-docs {
    margin: 40px auto;
    max-width: 850px;
  }

  :global {
    pre.hljs{
      border: 1px solid #ccc;
    }
  }

  div.repo-link {
    position: fixed;
    right: 15px;
    bottom: 10px;
    z-index: 999;
    a {
      color: #ddd;
      font-size: 46px;
      &:hover {
        color: #999;
      }
    }
  }
</style>

<script>
  export let chart;
  export let chartProps;
  import transform from 'lodash/transform';
  import isEqual from 'lodash/isEqual';
  import isObject from 'lodash/isObject';
  import { Highlight } from "svelte-highlight";
  import { javascript, bash, scss } from "svelte-highlight/languages";
  import { github } from "svelte-highlight/styles";
  import stringify from 'stringify-object';
  import { faGithub } from '@fortawesome/free-brands-svg-icons';
  import Icon from 'fa-svelte';

  const getCustomProps = (object, base) => {
    const changes = (object, base) =>
      transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    return changes(object, base);
  }

  // customProps is a string representing the props that are different
  // from your charts' defaultProps.
  $: customProps = stringify(getCustomProps(chartProps, chart.defaultProps), { indent: '  ' })
    .replace(/\n/g, '\n  '); // forces indenting props 2 extra spaces...
  

  /**
   * ✏️ DOCUMENTATION STRINGS BELOW
   */

  // Installation docs
  const installDocs = `$ yarn add https://github.com/reuters-graphics/chart-module-testing-dots.git`;

  // JavaScript docs
  $: jsDocs = `import Chart from '@reuters-graphics/testing-dots';

const chart = new Chart();

chart
  .data(yourData)
  .props(${customProps})
  .draw();
`;

  // SCSS docs
  const styleDocs = `$TestingDots-container: '.testing-dots-container';

@import '~@reuters-graphics/testing-dots/src/scss/chart';`;

</script>

<svelte:head>
  {@html github}
</svelte:head>

<div class='chart-docs'>
  <Highlight language={bash} code={installDocs} />
  <Highlight language={scss} code={styleDocs} />
  <Highlight language={javascript} code={jsDocs} />
</div>

<!-- 🔗 A link to your chart's GitHub repo -->
<div class='repo-link'>
  <a href="https://github.com/reuters-graphics/chart-module-testing-dots" target="_blank">
    <Icon icon={faGithub} />
  </a>
</div>
