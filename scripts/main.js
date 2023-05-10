import ReflectionChart from './reflection-chart.js'
import AppleChart from './apple-chart.js'
import AppleCovered from './apple-covered.js'

const firstChart = new ReflectionChart('part-1')
firstChart.create()

const secondChart = new AppleChart('part-2')
secondChart.create()

const thirdChart = new AppleCovered('part-3')
thirdChart.create()