<template>
    <div class="jms-dashboard jms-scrollBar">
        <div class="jms-dashboard-chart">
            <div class="jms-chartTitle">DashBoard</div>
            <div id="jms-myChart" class="jms-myChart"></div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
// import echarts from 'echarts/lib/echarts'
// import bar from 'echarts/lib/chart/bar'
// import tooltip from 'echarts/lib/component/tooltip'
// import title from 'echarts/lib/component/title'
export default {
    name: 'Dashboard',
    data() {
        return {

        }
    },
    mounted() {
        this.drawLine();
    },
    methods: {
        drawLine() {
            var myChart = this.$echarts.init(document.getElementById('jms-myChart'), 'dark');
            var option = {
                title: {
                    text: 'My JMS Dashboard'
                },
                // backgroundColor: 'black',
                // textStyle: {
                //     color: 'red'
                // },
                legend: {
                    data: ['Time']
                },
                tooltip:{
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#283b56'
                        }
                    }
                },
                xAxis: {name: 'Week', data: []},
                yAxis: {name: 'Num'},
                series: [{
                    name: 'Time',
                    type: 'bar',
                    color: ['yellow', 'red'],
                    data: []
                }]
            }
            myChart.setOption(option);
            myChart.showLoading({
                    color: '#e5e5e5',
                    textColor: '#e5e5e5',
                    maskColor: 'rgba(250, 250, 250, 0.3)'
                });
            setTimeout(()=>{
                myChart.hideLoading();
                myChart.setOption({
                    xAxis: {
                        data: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
                    },
                    series: [{
                        name: 'Time',
                        data: [6, 20, 38, 18, 17, 9, 1]
                    }]
                });
            }, 3000);
        }
    }
}
</script>

<style scoped>
    .jms-dashboard{
        margin: 20px 10px;
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap: 5px;
    }
    .jms-dashboard > div{
        color: #fff;
        background: antiquewhite;
        font-size: 35px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .jms-dashboard-chart{

    }
    .jms-dashboard .jms-dashboard-chart .jms-myChart{
        width: 100%;
        height: 300px;;
    }
</style>
