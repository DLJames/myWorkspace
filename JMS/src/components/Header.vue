<template>
    <nav class="jms-navbar jms-navbar-fixed-top">
        <div class="jms-nav-wrapper">
            <div class="jms-navbar-header">
                <div class="jms-navbar-header-leftCon">
                    <div class="jms-opener-left-menu is-closed">
                        <span class="top"></span>
                        <span class="middle"></span>
                        <span class="bottom"></span>
                    </div>
                    <div class="jms-navbar-brand">JMS</div>
                    <div class="jms-search-nav">
                        <el-input
                            placeholder="Please enter job name"
                            prefix-icon="el-icon-search"
                            v-model="jobname"
                            clearable>
                        </el-input>
                    </div>
                </div>
                <div class="jms-navbar-header-rightCon">
                    <div class="jms-navbar-username"><span>{{username}}</span></div>
                    <div class="jms-navbar-profile">
                        <img src="http://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/AVEKTK672" class="img-circle" :alt="username">
                    </div>
                </div>
            </div>
          </div>
        </nav>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Header',
    data() {
        return {
            username: 'BaoNan (James) Shan',
            jobname: ''
        }
    },
    methods: {

    }
}
</script>

<style scoped>
    .jms-navbar{
        height: 55px;
        background-color: #2196F3;
        color: #fff;
        border: none;
        min-height: 50px;
        margin-bottom: 20px;
    }
    .jms-navbar-fixed-top{
        position: fixed;
        top: 10px;
        right: 0;
        left: 0;
        z-index: 1000;
    }
    .jms-navbar .jms-nav-wrapper{
        width: 100%;
        height: 100%;
        padding-left: 15px;
        padding-right: 15px;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon{
        display: flex;
        align-items: center;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu{
        padding: 20px;
        padding-top: 35px;
        background-color: #2196F3;
        padding-bottom: 11px;
        color: #C62828;
        cursor: pointer;
        -webkit-box-shadow: 0px -12px 0px 0px #2196F3, 4px 0 15px -4px rgba(0, 0, 0, 0.16), -4px 0 15px -4px rgba(0, 0, 0, 0.12);
        -moz-box-shadow: 0px -12px 0px 0px #2196F3, 4px 0 15px -4px rgba(0, 0, 0, 0.16), -4px 0 15px -4px rgba(0, 0, 0, 0.12);
        box-shadow: 0px -12px 0px 0px #2196F3, 4px 0 15px -4px rgba(0, 0, 0, 0.16), -4px 0 15px -4px rgba(0, 0, 0, 0.12);
    }
    .opener-left-menu.is-open{
        padding-top: 29px;
        padding-bottom: 17px;
    }
    .jms-opener-left-menu:hover,
    .jms-opener-left-menu:focus,
    .jms-opener-left-menu:active {
        outline: none;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu.is-closed:before{
        content: '';
        display: block;
        width: 30px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        -webkit-opacity: 0;
        -moz-opacity: 0;
        opacity: 0;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu.is-closed:hover:before{
        -webkit-opacity: 1;
        -moz-opacity: 1;
        opacity: 1;
        display: block;
        -webkit-transform: translate3d(-100px, 0, 0);
        -moz-transform: translate3d(-100px, 0, 0);
        transform: translate3d(-100px, 0, 0);
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu > span{
        position: absolute;
        height: 4px;
        width: 30px;
        background-color: #FFFFFF;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu.is-closed .top{
        top: 15px;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu.is-closed .middle{
        top: 24px;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu.is-closed .bottom{
        top: 32px;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu.is-closed:hover .top{
        top: 10px;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-opener-left-menu.is-closed:hover .bottom{
        bottom: 10px;
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    .jms-opener-left-menu.is-open .top,
    .jms-opener-left-menu.is-open .bottom {
        margin-top: -2px;
    }
    .jms-opener-left-menu.is-open .top {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        transform: rotate(45deg);
        -webkit-transition: -webkit-transform .2s cubic-bezier(.73, 1, .28, .08);
        -moz-transition: -webkit-transform .2s cubic-bezier(.73, 1, .28, .08);
        transition: -webkit-transform .2s cubic-bezier(.73, 1, .28, .08);
    }
    .jms-opener-left-menu.is-open .middle {
        display: none;
    }
    .jms-opener-left-menu.is-open .bottom {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        transform: rotate(-45deg);
        -webkit-transition: -webkit-transform .2s cubic-bezier(.73, 1, .28, .08);
        -moz-transition: -webkit-transform .2s cubic-bezier(.73, 1, .28, .08);
        transition: -webkit-transform .2s cubic-bezier(.73, 1, .28, .08);
    }
    .jms-opener-left-menu.is-open:before {
        content: '';
        display: block;
        width: 30px;
        font-size: 14px;
        color: #fff;
        line-height: 32px;
        text-align: center;
        -webkit-opacity: 0;
        -moz-opacity: 0;
        opacity: 0;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    .jms-opener-left-menu.is-open:hover:before {
        -webkit-opacity: 1;
        -moz-opacity: 1;
        opacity: 1;
        display: block;
        -webkit-transform: translate3d(-100px, 0, 0);
        -moz-transform: translate3d(-100px, 0, 0);
        transform: translate3d(-100px, 0, 0);
        -webkit-transition: all .35s ease-in-out;
        -moz-transition: all .35s ease-in-out;
        transition: all .35s ease-in-out;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-navbar-brand{
        text-shadow: 0px 1px 5px #918C8C;
        margin-left: 20px;
        margin-right: 20px;
        font-size: 2.3em;
        color: #FFFFFF !important;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-search-nav{
        width: 300px;
        padding-left: 10px;

    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-leftCon .jms-navbar-right{
        float: right;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-rightCon{
        height: 20px;
        display: flex;
        align-content: center;
    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-rightCon .jms-navbar-username{

    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-rightCon .jms-navbar-profile{

    }
    .jms-navbar .jms-nav-wrapper .jms-navbar-header .jms-navbar-header-rightCon .jms-navbar-profile .img-circle{
        height: 40px;
        width: 40px;
        border: 4px solid #108DB6 !important;
        border-radius: 50%;
    }
</style>


