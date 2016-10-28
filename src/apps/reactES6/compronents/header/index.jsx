import React, {Component} from 'react';
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
        //渲染主导航
        var mainnav=props.mainNav.map((item, i) => (
            <Nav1
                {...props}
                {...item}
                childNav={props.childNav}
            />
        ))
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
            </div>
        )
    }
}
//主导航
class Nav1 extends Component {
    onRequestContentList(ev, id){
        if (id && id>0) {
            this.props.requestContentList(id);setTimeout(function(){
                $("#radio_navmenu").prop("checked",true);
            },50);
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
                        navdata={nav3}
                        {...item}
                        requestContentList={props.requestContentList}
                    />
                )
            }
        })
        return (
            <li key={props.id}>
                <span onClick={(ev, id) => {this.onRequestContentList(ev,props.id)}}>{props.title}</span>
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
        }
    }
    render(){
        let props=this.props;
        return (
            <li key={props.id}>
                <span onClick={(ev, id) => {this.onRequestContentList(ev,props.id)}}>{props.title}</span>
                <ul className="n">
                    {props.navdata.map((item, i) => (
                        <li key={props.id + '' +item.id}>
                            <span onClick={(ev, id) => {this.onRequestContentList(ev,item.id)}}>{item.title}</span>
                        </li>
                    ))}
                </ul>
            </li>
        )
    }
}
export default Header;
