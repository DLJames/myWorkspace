<template>
    <div class="jms-dashboard">
        <ChartUtil :jobtitle="jobtitle"></ChartUtil>
        <Calendar></Calendar>
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
    }
}
</script>

<style scoped>
    .jms-dashboard{
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        grid-gap: 5px;
    }
    .jms-dashboard .jms-chartUtil{
        grid-column: 1 / 3;
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
