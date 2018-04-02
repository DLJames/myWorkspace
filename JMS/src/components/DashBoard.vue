<template>
    <div class="jms-dashboard jms-scrollBar">
        <div class="jms-dashboard-header">DashBoard</div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Dashboard',
    data() {
        return {

        }
    },
    mounted() {
        // let arr = Array.apply(null, {length:200});
        // var domNode = document.querySelector('.jms-dashboard');
        // arr.forEach((element, idx) => {
        //     var d = document.createElement('div');
        //     d.innerHTML  = idx;
        //     domNode.appendChild(d);
        // });
    },
    methods: {

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
        justify-content: center;
        align-items: center;
    }
</style>
