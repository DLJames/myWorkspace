<template>
    <div class="jms-chartUtil">
        <div class="jms-myChart"></div>
    </div>
</template>

<script>
/* eslint-disable */

import jobData from '../static/jobData.json'
import DateFormater from '../util/DateFormater'

export default {
    name: 'ChartUtil',
    data() {
        return {
            myChart: null,
            subjobtitle: '',
            chartOpt: {
                title: {
                    text: this.jobtitle,
                    subtext: this.subjobtitle,
                    textStyle: {
                        fontSize: 13
                    },
                    left: 10
                },
                legend: {
                    data: ['PT','AT']
                },
                grid: {
                    top: 80,
                    left: 10,
                    right: 40,
                    bottom: 40,
                    containLabel: true
                },
                tooltip:{
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#283b56'
                        }
                    }
                }
            }
        }
    },
    props: ['jobtitle'],
    mounted() {
        this.drawLine();
    },
    methods: {
        drawLine() {
            let _dom = this.$el.querySelector('.jms-myChart');

            this.myChart = this.$echarts.init(_dom, 'dark');
            this.myChart.setOption(this.chartOpt);
            this.showChartLoading();

            let me = this;
            setTimeout(()=>{
                let jobArr = jobData.data[me.jobtitle];
                let ptData = [];
                let atData = [];
                let xAxisData = [];
                let opt = {};

                jobArr.forEach((item) => {
                    let time = (new Date(item.endTime) - new Date(item.startTime)) / 1000 / 60;

                    me.subjobtitle = DateFormater(item.startTime, 'hh:mm');
                    
                    atData.push(time);
                    ptData.push(parseInt(item.planTime));
                    xAxisData.push(item.startTime.split(' ')[0]);
                })

                opt = {
                    title:{
                        subtext: 'job start time: ' + me.subjobtitle
                    },
                    dataZoom: [
                    {
                        show: true,
                        type: 'slider',
                        start: 50,
                        end: 100,
                        // startValue: 1,
                        // endValue: 6,
                        dataBackground: {
                            lineStyle: {
                                color: 'rgba(255,255,255,0.8)'
                            },
                            areaStyle: {
                                color: 'rgba(255,255,255,0.8)'
                            }
                        }
                    }
                    ],
                    xAxis: {
                        name: 'Day',
                        type: 'category',
                        data: xAxisData
                    },
                    yAxis: {
                        name: 'Time (minute)',
                        nameTextStyle: {
                            padding: [0,0,0,10]
                        },
                        type: 'value',
                    },
                    series: [{
                        name: 'PT',
                        type: 'bar',
                        color: ['yellow'],
                        data: ptData
                    },
                    {
                        name: 'AT',
                        type: 'bar',
                        color: ['green'],
                        data: atData
                    }]
                };

                me.hideChartLoading();
                me.myChart.setOption(opt);
            }, 3000);
        },

        updateChartView(date) {
            let me = this;

            me.showChartLoading();
            setTimeout(() => {
                let jobArr = jobData.data[date];
                me.hideChartLoading();
            }, 3000);
        },

        showChartLoading() {
            this.myChart.showLoading({
                color: '#e5e5e5',
                textColor: '#e5e5e5',
                maskColor: 'rgba(250, 250, 250, 0.3)'
            });
        },

        hideChartLoading() {
            this.myChart.hideLoading();
        }
    }
}

</script>

<style scoped>
    .jms-chartUtil{
        width: 100%;
        /* height: 300px; */
        min-height: 300px;
        display: flex;
    }
    .jms-chartUtil .jms-myChart{
        flex: 1;
    }
</style>
