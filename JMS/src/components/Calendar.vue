<template>
    <div class="jms-calendarUtil">
        <el-date-picker
            v-model="value2"
            align="right"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="Enter date"
            :picker-options="pickerOptions1"
            size="large"
            @change="valueChange">
        </el-date-picker>
    </div>
</template>

<script>
/* eslint-disable */
// import fullCalendar from 'vue-fullcalendar'

export default {
    name: 'calendar',
    data() {
        return {
            pickerOptions1: {
            disabledDate(time) {
                return time.getTime() > Date.now();
            },
            shortcuts: [{
                text: '今天',
                onClick(picker) {
                picker.$emit('pick', new Date());
                }
            }, {
                text: '昨天',
                onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
                }
            }, {
                text: '一周前',
                onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
                }
            }]
        },
        value2: '',
        }
    },
    methods: {
        valueChange(evt) {
            console.log('=====', evt)
        }
    },
    components: {}
}
</script>

<style scoped>
    .jms-calendarUtil{
        width: 100%;
        /* display: flex; */
    }
</style>
