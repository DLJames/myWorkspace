<template>
    <div class="jms-search">
        <input class="jms-searchInput" type="text" placeholder="Please enter job name"/>
        <span class="jms-searchIcon" @click="searchAction"></span>

    </div>
</template>

<script>
/* eslint-disable */

export default {
    name: 'Search',
    data() {
        return {

        }
    },
    components: {},
    methods: {
        searchAction() {
            alert(1)
        }
    }
}
</script>

<style scoped>
    .jms-search{
        /* position: fixed; */
        display: flex;
        justify-content: center;
        margin: 30px;
        height: 50px;
        min-height: 50px;
    }
    .jms-search .jms-searchInput{
        width: 60%;
        font-size: 20px;
        padding-left: 10px;
        padding-right: 10px;
    }
    .jms-search .jms-searchIcon{
        background-image: url('../assets/search-button.svg');
        background-repeat: no-repeat;
        width: 50px;
        height: 50px;
        background-size: 50px 50px;
        cursor: pointer;
     }
</style>

