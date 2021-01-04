import * as d3 from 'd3';

import BaseChartComponent from './baseClasses/ChartComponent';

/**
 * Write your chart as a class with a single draw method that draws
 * your chart! This component inherits from a base class you can
 * see and customize in the baseClasses folder.
 */
class TestingDots extends BaseChartComponent {
    /**
     * Default props are the built-in styles your chart comes with
     * that you want to allow a user to customize. Remember, you can
     * pass in complex data here, like default d3 axes or accessor
     * functions that can get properties from your data.
     */
    defaultProps = {
      formatters: {
        time: '%Y-%m-%d',
      },
      avg_days: 7,
      fills: {
        positive: '#fce587',
        refbox: 'rgba(255,255,255,.2)',
        tests: '#efefef',
      },
      dotSize: 15,
      dotMargin: 4,
      refBoxValue: 5,
      labelText: 'W.H.O. Recommendation',
      labelColor: 'rgba(255,255,255,.4)',
    };

    /**
     * Default data for your chart. Generally, it's NOT a good idea to import
     * a big dataset and assign it here b/c it'll make your component quite
     * large in terms of file size. At minimum, though, you should assign an
     * empty Array or Object, depending on what your chart expects.
     */
    // defaultData = {};

    /**
     * Write all your code to draw your chart in this function!
     * Remember to use appendSelect!
     */
    draw() {
      const data = this.data(); // Data passed to your chart
      const props = this.props(); // Props passed to your chart
      const caseParse = d3.timeParse(props.formatters.time);

      data.cases = data.cases.sort((a, b) => (d3.descending(caseParse(a.date), caseParse(b.date))));
      data.tests = data.tests.sort((a, b) => (d3.descending(caseParse(a.date), caseParse(b.date))));

      for (let i = 0; i < data.cases.length; i++) {
        data.cases[i].parsedDate = caseParse(data.cases[i].date);
        data.cases[i].mean = d3.mean(data.cases.slice(i, (i + props.avg_days)), d => +d.count < 0 ? 0 : d.count); // avg calc
      }

      for (let i = 0; i < data.tests.length; i++) {
        data.tests[i].parsedDate = caseParse(data.tests[i].date);
        data.tests[i].mean = d3.mean(data.tests.slice(i, (i + props.avg_days)), d => +d.count < 0 ? 0 : d.count); // avg calc
      }

      for (let i = 0; i < data.tests.length; i++) {
        let caseNum = data.cases.filter(d=> d.date === data.tests[i].date)[0];
        if (caseNum) {
          data.tests[i].caseMean = caseNum.mean;
          data.tests[i].posRate = data.tests[i].caseMean/data.tests[i].mean * 100;
        }
      }

      const useNum = data.tests.filter(d => d.posRate)[0];
      let usePosRate;

      if (useNum.posRate > 1) {
        usePosRate = Math.floor(useNum.posRate);
      } else {
        usePosRate = useNum.posRate;
      }

      let useArray, useRefVal, useSize, useMargin;
      if (usePosRate > 1) {
        useArray = Array.from(Array(100).keys());
        useRefVal = props.refBoxValue
        useSize = props.dotSize;
        useMargin = props.dotMargin;
      } else if (usePosRate > 0.1) {
        useArray = Array.from(Array(1000).keys());
        useRefVal = props.refBoxValue*10
        useSize = Math.floor(props.dotSize/2)
        useMargin = props.dotMargin/2;
      }

      const transition = d3.transition()
        .duration(500);

      this.selection()
        .appendSelect('div.ref-box')
        .style('background-color', props.fills.refbox)
        .style('margin-left', `-${useMargin}px`)
        .style('margin-top', `-${useMargin}px`)
        .style('width', (((useRefVal + 1) * (useMargin + useSize)) + (useMargin * 2)) + 'px')
        .style('height', ((useMargin * 4) + useSize) + 'px');

      this.selection()
        .appendSelect('p.ref-box-label')
        .style('margin-left', `-${useMargin}px`)
        .text(props.labelText)
        .style('color', props.labelColor)

      this.div = this.selection()
        .appendSelect('div.dot-box');// 👈 Use appendSelect instead of append for non-data-bound elements!

      const plot = this.div;

      // We're using d3's new data join method here.
      // Read more about that here: https://observablehq.com/@d3/selection-join
      // ... or feel free to use the old, reliable General Update Pattern.
      plot.selectAll('div.dot-el')
        .data(useArray)
        .join(
          enter => enter.append('div')
            .attr('class', 'dot-el')
            .style('background-color', (d, i) => {
              if (i < usePosRate) {
                return props.fills.positive;
              } else {
                return props.fills.tests;
              };
            })
            .style('height', useSize + 'px')
            .style('width', useSize + 'px')
            .style('margin', useMargin + 'px')
            .call(enter => enter.transition(transition)
            ),

          update => update
            .style('background-color', (d, i) => {
              if (i < usePosRate) {
                return props.fills.positive;
              } else {
                return props.fills.tests;
              };
            })
            .call(update => update.transition(transition)
            ),

          exit => exit
            .call(exit => exit.transition(transition)
              .remove())
        );


      return this; // Generally, always return the chart class from draw!
    }
}

export default TestingDots;
