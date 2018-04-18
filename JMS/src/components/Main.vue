<template>
    <div class="jms-wraper">
        <Header></Header>
        <div class="jms-mainContent">
            <DashBoard :jobtitle='jobtitle'></DashBoard>
        </div>
        <div v-show="showCalendar" class="jms-calendarCon">
           <Calendar></Calendar>
       </div>
    </div>
</template>

<script>
/* eslint-disable */

import Header from './Header'
import DashBoard from './DashBoard'
import Calendar from './Calendar'

export default {
    name: 'Main',
    data() {
        return {
            showCalendar: false,
            jobtitle: 'DM_001'
        }
    },
    components: {Header, DashBoard, Calendar}
}
</script>

<style scoped>
    .jms-wraper{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .jms-wraper .jms-mainContent{
        margin: 0 30px 30px 30px;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .jms-wraper .jms-calendarCon{
        flex: 1;
    }
</style>
