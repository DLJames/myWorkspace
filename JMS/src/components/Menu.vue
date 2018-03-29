<template>
    <div class="jms-menu" :class="{'jms-showMenu': styleParams.showMenu}">JMS Menu</div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Menu',
    data() {
        return {
            styleParams: {
                showMenu: false
            }
        }
    },
    methods: {
        openMenu() {
            this.showMenu = !this.showMenu;
        }
    }
}
</script>

<style scoped>
    .jms-menu{
        width: 230px;
        height: calc(100% - 80px);
        position: absolute;
        top: 80px;
        left: -230px;
        z-index: 10000;
        background: cornflowerblue;
    }
    .jms-menu.jms-showMenu{
        width: 230px;
        left: 0;
    }
</style>


