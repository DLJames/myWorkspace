<template>
    <div class="jms-chartUtil">
        <div id="jms-myChart" class="jms-myChart"></div>
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
            chartOpt: {},
            subjobtitle: ''
        }
    },
    props: ['jobtitle'],
    mounted() {
        this.drawLine();
    },
    methods: {
        drawLine() {
            this.myChart = this.$echarts.init(document.getElementById('jms-myChart'), 'dark');
            this.chartOpt = {
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
                },
                dataZoom: [
                    {
                        show: true,
                        type: 'slider',
                        start: 30,
                        end: 70,
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
                },
                yAxis: {
                    name: 'Time',
                    type: 'value',
                },
                series: [{
                    name: 'PT',
                    type: 'bar',
                    color: ['yellow'],
                    data: []
                },
                {
                    name: 'AT',
                    type: 'bar',
                    color: ['green'],
                    data: []
                }]
            }

            this.myChart.setOption(this.chartOpt);
            this.myChart.showLoading({
                color: '#e5e5e5',
                textColor: '#e5e5e5',
                maskColor: 'rgba(250, 250, 250, 0.3)'
            });

            var me = this;
            setTimeout(()=>{
                var jobArr = jobData.data[me.jobtitle];
                var ptData = [];
                var atData = [];
                var xAxisData = [];
                var opt = {};

                jobArr.forEach((item) => {
                    var time = (new Date(item.endTime) - new Date(item.startTime)) / 1000 / 60;

                    me.subjobtitle = DateFormater(item.startTime, 'hh:mm');
                    
                    atData.push(time);
                    ptData.push(parseInt(item.planTime));
                    xAxisData.push(item.startTime.split(' ')[0]);
                })

                opt = {
                    title:{
                        subtext: 'job start time: ' + me.subjobtitle
                    },
                    xAxis: {
                        data: xAxisData
                    },
                    series: [{
                        name: 'PT',
                        data: ptData
                    },
                    {
                        name: 'AT',
                        data: atData
                    }]
                };

                me.myChart.hideLoading();
                me.myChart.setOption(opt);
            }, 3000);
        }
    }
}

</script>

<style scoped>
    .jms-chartUtil{
        width: 100%;
        /* height: 300px; */
        display: flex;
    }
    .jms-chartUtil .jms-myChart{
        flex: 1;
    }
</style>
