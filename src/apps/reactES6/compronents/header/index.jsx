import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import $ from "webpack-zepto";
import '../../../../public/plugin/swiper/swiper.min.css'
import Swiper from '../../../../public/plugin/swiper/swiper.min.js';

class Header extends Component {
    constructor(props){
        super(props);
        //滑动功能
        this.onSwiper = () =>{
            var swiper = new Swiper('.swiper-menu', {
                scrollbar: '.swiper-scrollbar',
                direction: 'vertical',
                slidesPerView: 'auto',
                mousewheelControl: true,
                freeMode: true,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
                onSetTransition: function(swiper, transiton) {
                    swiper.onResize();
                },
                onTouchStart: function(swiper, even) {
                    swiper.onResize();
                }
            });

            var swiperH = new Swiper('.swiper-tab', {
                scrollbar: '.swiper-scrollbar',
                direction: 'horizontal',
                slidesPerView: 'auto',
                mousewheelControl: true,
                freeMode: true,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
                onTouchStart: function(swiper, even) {
                    swiper.onResize();
                }
            });
        }
    }
    componentWillMount(){
        //初始化时、内容页刷新后返回时，请求 推荐 栏目信息，
        let props = this.props;
        if ((!props.mainNav || !props.mainNav.length || props.channelId == 0) && props.navMenu != "hide") {
            this.props.requestContentList(16);
        }
    }
    componentDidMount(){
        this.onSwiper();
    }
    onHistory(){
        window.history.go(-1);
    }
    render() {
        let props = this.props;
        //存储推荐导航
        let recommend=[];
        //渲染主导航
        let mainnav=[];
        //push非  只推荐  的导航
        props.mainNav.forEach((item, i) => {
            if (item.recommend < 2) {
                mainnav.push (
                    <Nav1
                        key={'nav1'+i}
                        {...props}
                        {...item}
                        childNav={props.childNav}
                    />
                )
            }
            if (item.recommend >= 1) {
                recommend.push(item);
            }
        });
        //push保存子类推荐的导航
        props.childNav.forEach((item, i) => {
            if (item.recommend == 2) {
                recommend.push(item);
            }
        });
        let recommendNav = recommend.map((item, i) => (
            <RecommendNav
                key={'recommendNav'+i}
                item={item}
                requestContentList={props.requestContentList}
                updateState={props.updateState}
                mainNav={props.mainNav}
                childNav={props.childNav}
                swiperY={props.swiperY}
            />
        ));
        return (
            <div className="tab-navigation">
                <header>
                    <label onClick={this.onHistory}>{props.backBtn != "hide" ?<span>后退</span> : ''}</label>
                    {props.navMenu != "hide" ?
                        <label>
                            <input type="radio" name="navmenu" />
                            <span>菜单</span>
                            <div className="menu">
                                <div className="swiper-container swiper-menu">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide">
                                            <ul className="n mav-list">
                                                {mainnav}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="swiper-scrollbar"></div>
                                </div>
                                <label>
                                    <input type="radio" name="navmenu" id="radio_navmenu" />
                                </label>
                            </div>
                        </label>
                    :
                        ''
                    }
                    <h3>{props.documentTitle}</h3>
                </header>
                {props.navMenu != "hide" ?
                    <div className="tabnav swiper-container swiper-tab">
                        <div className="swiper-wrapper">
                                <div className="swiper-slide" style={{whiteSpace:"nowrap"}}>
                                    <div>
                                        {recommendNav}
                                    </div>
                                </div>
                        </div>
                        <div className="swiper-scrollbar"></div>
                    </div> : '' }
            </div>
        )
    }
}
//推荐选项卡导航
class RecommendNav extends Component {
    onRequestContentList(ev, id){
        let props = this.props;
        if (id && id>0) {
            this.props.requestContentList(id);
            //更新栏目id
            props.updateState.channelId(props.item.id);
            //重新更新导航活动状态
            props.updateState.mainNav(props.mainNav);
            props.updateState.childNav(props.childNav);
            //更新webTitle
            props.updateState.documentTitle(props.item.title);
            //每次点选项卡判断滑屏尺寸是否异常，则修正
            $(".contentlist-slide").each(function(){
                //安卓下列表滚动异常的问题
                if ($(this).height() < $(this).children().height()+10){
                    $(this).height($(this).children().height()+80);
                }
            });
            //恢复之前记录的滑动Y值
            if (props.swiperY["id_"+id]){
                window.swiper["id_"+id].setWrapperTranslate(props.swiperY["id_"+id]);
            }
        }
    }
    render(){
        let props = this.props.item;
        var activeStyle = {};
        if (props.active){
            activeStyle = {borderBottom:"2px solid #2196f3",color:"#2196f3",fontWeight:"bold"}
            //activeStyle = {}
        }

        return (
            <div ref="tabnav"><span style={activeStyle} onClick={(ev, id) => {this.onRequestContentList(ev,props.id)}}>{props.title}</span></div>
        )
    }
}
//主导航
class Nav1 extends Component {
    onRequestContentList(ev, id){
        if (id && id>0) {
            this.props.requestContentList(id);
            setTimeout(function(){
                $("#radio_navmenu").prop("checked",true);
            },50);
            //每次点选项卡判断滑屏尺寸是否异常，则修正
            $(".contentlist-slide").each(function(){
                //安卓下列表滚动异常的问题
                if ($(this).height() < $(this).children().height()+10){
                    $(this).height($(this).children().height()+80);
                }
            });
            //恢复之前记录的滑动Y值
            if (props.swiperY["id_"+id]){
                window.swiper["id_"+id].setWrapperTranslate(props.swiperY["id_"+id]);
            }
        }
    }
    render(){
        let props = this.props;
        let nav2 =[],nav3=[];
        props.childNav.forEach((item, i) => {
            if (item.pid == props.id){
                nav3=[];
                props.childNav.forEach((item2, j) => {
                    if (item2.pid == item.id){
                        nav3.push(item2);
                    }
                })
                nav2.push (
                    <Nav2
                        key={'nav2'+props.id+i}
                        navdata={nav3}
                        {...item}
                        requestContentList={props.requestContentList}
                    />
                )
            }
        })
        return (
            <li key={props.id}>
                <span style={props.active ? {fontWeight:"bold",color:"#FFC107"}:{}} onClick={(ev, id) => {this.onRequestContentList(ev,props.id)}}>{props.title}</span>
                <ul className="n">
                    {nav2}
                </ul>

            </li>
        )

    }
}
//二三级导航
class Nav2 extends Component {
    onRequestContentList(ev, id){
        if (id && id>0) {
            this.props.requestContentList(id);
            setTimeout(function(){
                $("#radio_navmenu").prop("checked",true);
            },50);
            //每次点选项卡判断滑屏尺寸是否异常，则修正
            $(".contentlist-slide").each(function(){
                //安卓下列表滚动异常的问题
                if ($(this).height() < $(this).children().height()+10){
                    $(this).height($(this).children().height()+80);
                }
            });
            //恢复之前记录的滑动Y值
            if (props.swiperY["id_"+id]){
                window.swiper["id_"+id].setWrapperTranslate(props.swiperY["id_"+id]);
            }
        }
    }
    render(){
        let props=this.props;
        return (
            <li key={props.id}>
                <span style={props.active ? {fontWeight:"bold",color:"#FFC107"}:{}} onClick={(ev, id) => {this.onRequestContentList(ev,props.id)}}>{props.title}</span>
                <ul className="n">
                    {props.navdata.map((item, i) => (
                        <li key={'nav3'+props.id + '' +item.id}>
                            <span onClick={(ev, id) => {this.onRequestContentList(ev,item.id)}}>{item.title}</span>
                        </li>
                    ))}
                </ul>
            </li>
        )
    }
}
export default Header;
