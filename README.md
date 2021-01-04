![](./badge.svg)

# TestingDots

### Install

```
$ yarn add https://github.com/reuters-graphics/chart-module-testing-dots.git
```

### Use

```javascript
import TestingDots from '@reuters-graphics/chart-module-testing-dots';

const chart = new TestingDots();

// To create your chart, pass a selector string to the chart's selection method,
// as well as any props or data to their respective methods. Then call draw.
chart
  .selection('#chart')
  .data({
    cases: caseData.cases,
    tests: testData.testingData.test_dailycount,
  })
  .props({ 
    formatters: {
      // to format the dates in the data
      time: '%Y-%m-%d',
    },
    // rolling avg of how many days
    avg_days: 7,
    fills: {
      // positive dots
      positive: '#fce587',
      // reference box for WHO recommendation
      refbox: 'rgba(255,255,255,.2)',
      // tests
      tests: '#efefef',
    },

    // height and width of dot
    dotSize: 15,

    // padding between dots
    dotMargin: 4,

    // what is the WHO recommendation
    refBoxValue: 5,

    // label for WHO rec
    labelText: 'W.H.O. Recommendation',

    // fill for label text
    labelColor: 'rgba(255,255,255,.4)',
  })
  .draw();

// You can call any method again to update the chart.
chart
  .data([3, 4, 5])
  .draw();

// Or just call the draw function alone, which is useful for resizing the chart.
chart.draw();
```

To apply this chart's default styles when using SCSS, simply define the variable `$TestingDots-container` to represent the ID or class of the chart's container(s) and import the `_chart.scss` partial.

```CSS
$TestingDots-container: '#chart';

@import '~@reuters-graphics/chart-module-testing-dots/src/scss/chart';
```

## Developing chart modules

Read more in the [DEVELOPING docs](./DEVELOPING.md) about how to write your chart module.