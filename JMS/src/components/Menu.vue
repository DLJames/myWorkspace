<template>
    <div class="jms-menu" :class="{'jms-showMenu': showmenu}">
        <div class="jms-menu-title">JMS Menu</div>
        <div class="jms-menu-item">
            <span>
                <span class="jms-menu-item-icon el-icon-info"></span>
                <span>menu item 1</span>
            </span>
            <span class="el-icon-arrow-right"></span>
        </div>
        <div class="jms-menu-item">
            <span>
                <span class="jms-menu-item-icon el-icon-info"></span>
                <span>menu item 2</span>
            </span>
            <span class="el-icon-arrow-right"></span>
        </div>
        <div class="jms-menu-item">
            <span>
                <span class="jms-menu-item-icon el-icon-info"></span>
                <span>menu item 3</span>
            </span>
            <span class="el-icon-arrow-right"></span>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Menu',
    data() {
        return {
            
        }
    },
    props: ['showmenu'],
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
        height: calc(100% - 65px);
        position: fixed;
        top: 65px;
        left: -230px;
        padding: 20px 15px;
        z-index: 10000;
        background: #FFFFFF;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
        -webkit-box-shadow: 0 2px 5px 0 rgba(239, 235, 235, 0.16), 0 2px 10px 0 rgba(72, 70, 70, 0.12);
        -moz-box-shadow: 0 2px 5px 0 rgba(239, 235, 235, 0.16), 0 2px 10px 0 rgba(72, 70, 70, 0.12);
        box-shadow: 0 2px 5px 0 rgba(239, 235, 235, 0.16), 0 2px 10px 0 rgba(72, 70, 70, 0.12)
    }
    .jms-menu.jms-showMenu{
        width: 230px;
        left: 0px;
    }
    .jms-menu div{
        width: 100%;
        height: 50px;
    }
    .jms-menu .jms-menu-title{
        height: 80px;
        line-height: 80px;
    }
    .jms-menu .jms-menu-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .jms-menu .jms-menu-item .jms-menu-item-icon{
        color: #2196F3;
    }
</style>


