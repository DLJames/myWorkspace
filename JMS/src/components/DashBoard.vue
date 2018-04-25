<template>
    <div class="jms-dashboard">
        <ChartUtil class="jms-chart1" :jobtitle="jobtitle" ref="chartutil1"></ChartUtil>
        <Calendar @showchartbydate="createChartByDate"></Calendar>
        <ChartUtil class="jms-chart2" :jobtitle="jobtitle" ref="chartutil2"></ChartUtil>
    </div>
</template>

<script>
/* eslint-disable */
// import echarts from 'echarts/lib/echarts'
// import bar from 'echarts/lib/chart/bar'
// import tooltip from 'echarts/lib/component/tooltip'
// import title from 'echarts/lib/component/title'


import ChartUtil from './ChartUtil'
import Calendar from './Calendar'

export default {
    name: 'Dashboard',
    data() {
        return {
            
        }
    },
    props: ['jobtitle'],
    mounted() {
    },
    components: {
        ChartUtil, Calendar
    },
    methods: {
        createChartByDate(data) {
            console.log('data=====',data.date)
            let date = data.date;

            this.$refs.chartutil.updateChartView(date);
        },

        createChartByJob() {

        }
    }
}
</script>

<style scoped>
    .jms-dashboard{
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: 5px;
        margin-bottom: 30px;
    }
    .jms-dashboard .jms-chart1{
        grid-column: 1 / 4;
        grid-row: 1 / 2;
    }
    .jms-dashboard .jms-chart2{
        grid-column: 1 / 4;
        grid-row: 3 / 4;
    }
    /* .jms-dashboard > div{
        color: #fff;
        background: antiquewhite;
        font-size: 35px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    } */
</style>
