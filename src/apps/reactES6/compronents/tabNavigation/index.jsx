import React from 'react';
import {Link} from 'react-router';
import $ from "webpack-zepto";

class TabNavigation extends React.Component {
    onRequestContent(ev, id, pid) {
        ev.preventDefault();
        //若已加载首屏数据，则不重新请求
        let props = this.props;
        console.log(props)
        let channelsData=props.channelsData;
        //设置导航的当前激活状态
        let mainNav = props.mainNav.map( (item) => {
            item.active=0
            if (item.id==id){
                item.active=1;
                document.title=item.title;
            }
            return item;
        })
        //更新主导航
        props.updateState.mainNav(mainNav);
        let childNav = props.childNav.map( (item) => {
            item.active=0
            if (item.id==id){
                item.active=1;
                document.title=item.title;
            }
            return item;
        })
        //更新子导航
        props.updateState.childNav(childNav);

        if (channelsData && channelsData["id"+id]){
            //清除活动列表
            for (var item in channelsData){
                channelsData[item].active=0;
            }
            //置当前为活动列表
            channelsData["id"+id].active=1;
            //更新已访问的栏目数据
            props.updateState.channelsData(channelsData);
            return ;
        }
        //若未请求过，则请求首屏数据
        this.props.requestData(["channels", id]);
    }
    render() {
        let props = this.props;
        //渲染主导航
        var mainnav=props.mainNav.map((item, i) => (
            <Nav1
                {...props}
                {...item}
                childNav={props.childNav}
                onRequestContent={this.onRequestContent}
            />
        ))
        return (
            <div className="tab-navigation">
                <header>
                    <label href="javascript:;"><span>后退</span></label>
                    <label href="javascript:;">
                        <input type="radio" name="mavmenu" />
                        <span>菜单</span>
                        <div className="menu">
                            <div>
                                <ul className="n">
                                    {mainnav}
                                </ul>
                            </div>
                            <label>
                                <input type="radio" name="mavmenu" />
                            </label>
                        </div>
                    </label>
                    <h3>{props.documentTitle}</h3>
                </header>
                <ul>
                    {props.mainNav.map(
                        (item, i) => (
                            <li key={item.id}>
                                <Link
                                    to={`/channel/${item.pid}/${item.id}`}
                                    onClickCapture={(ev,id,pid) => {this.onRequestContent(ev,item.id,item.pid)}}
                                    className={item.active ? 'active' : ''}>
                                    <span dangerouslySetInnerHTML={{__html: item.title}}></span>
                                </Link></li>
                        )
                    )
                    }
                    <li>=====子导航数据=====</li>
                    {props.childNav.map(
                        (item, i) => (
                            <li key={item.id}>
                                <Link
                                    to={`/channel/${item.pid}/${item.id}`}
                                    onClickCapture={(ev,id,pid) => {this.onRequestContent(ev,item.id,item.pid)}}
                                    className={item.active ? 'active' : ''}>
                                    <span dangerouslySetInnerHTML={{__html: item.title}}></span>
                                </Link>
                            </li>
                        )
                    )
                    }
                </ul>
            </div>
        )
    }
}
//主导航
const Nav1 = (data) => {
    let nav2 =[],nav3=[];
    data.childNav.forEach((item, i) => {
        if (item.pid == data.id){
            nav3=[];
            data.childNav.forEach((item2, j) => {
                if (item2.pid == item.id){
                    nav3.push(item2);
                }
            })
            nav2.push (
                <Nav2
                    {...item}
                    navdata={nav3}
                />
            )
        }
    })
    return (
        <li key={data.id} onClick={(ev, id, pid) => {data.onRequestContent(ev,data.id,data.pid)}}>
            <span>{data.title}</span>
            <ul className="n">
                {nav2}
            </ul>

        </li>
    )
}
//二三级导航
const Nav2 = (data) => {
    return (
        <li key={data.id}>
            <span>{data.title}</span>
            <ul className="n">
                {data.navdata.map((item, i) => (
                    <li key={data.id + '' +item.id}>
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>
        </li>
    )
}
export default TabNavigation;
