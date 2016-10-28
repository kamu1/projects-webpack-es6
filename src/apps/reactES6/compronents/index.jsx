import React from 'react';
import {Router,Link} from 'react-router';
import $ from "webpack-zepto";
//require('es6-promise').polyfill();
import Config from '../common/config.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            documentTitle:"React demo",
            //主导航数据
            mainNav: [],
            //子导航数据
            childNav: [],
            //栏目数据
            channelsData:{},    //以不同的ID识别，通过in遍历
            //内容列表数据
            listData: [],
            //详细内容数据
            contentData: [],
            //当前被激活的栏目（接口情况需要）
            channelId: 0,
            //当前栏目的父栏目（接口参数需要）
            channelPId: 0,
            //当前类的下一页数据地址
            nextPage: "",
            //加载的方式，事件触发和刷新加载等
            pageHistory: ""
        }
        //更新内容列表数据（本地存储用到）
        this.updateState = {
            //更新页面文档标题
            documentTitle:(documentTitle) => {
                this.setState({documentTitle});
            },
            //更新列表数据
            channelsData: (channelsData,mainNav) => {
                this.setState({channelsData});
            },
            //更新内容数据
            contentData: (contentData) => {
                this.setState({contentData});
            },
            //更新主导航
            mainNav:(mainNav) => {
                this.setState({mainNav});
            },
            //更新子导航
            childNav:(childNav) => {
                this.setState({childNav});
            }
    }
        //请求接口数据，独立出来方便不同场景更换插件，如：fetch等
        this.handleAjax = (config, callback) => {
            if (!config && !config.url) {
                return;
            }
            $.ajax({
                url: config.url ? config.url : config,
                type: config.type ? config.type : "get",
                data: config.data ? config.data : {},
                dataType: config.dataType ? config.dataType : "jsonp",
                jsonpCallback: config.jsonpCallback ? config.jsonpCallback : "jsonpData",
                success: (!config.success || !(config.success instanceof Function)) ? (data) => {
                    if (callback) {
                        callback(data);
                    }
                } : config.success
            });
        }
        //请求数据，栏目及分页和内容共用此接口
        this.handleRequestData = (tag, callback) => {
            let dataUrl;
            if (tag instanceof Array) {
                //按ID拼接请求
                dataUrl = Config.dataUrl.prefix + tag.join("/") + '.jsonp';
            } else {
                //直接请求接口地址（这种情况只是特殊约定，很少会有）
                dataUrl = tag;
            }
            //默认栏目ID
            let cid = tag[1];
            //切换到内容ID
            if (tag[2]){
                cid=tag[2];
            }
            //单独传递的栏目ID，分页情况下`
            if (callback && parseInt(callback)>0){
                cid = callback;
            }
            this.handleAjax({
            "url": dataUrl,
            jsonpCallback: 'jsonpData' + cid
        }, (data) => {
                if (data.childChannels instanceof Array && this.state.channelsData) {
                    //栏目组数据
                    let channelsData=this.state.channelsData;
                    //所有列表窗口移除状态
                    for (var item in channelsData){
                        channelsData[item].active=0;
                    }
                    //请求栏目内容列表，若传数据，请求第一屏
                    if (tag instanceof Array) {

                        //初屏数据
                        this.setState({listData: data.list, channelId: tag[1], channelPId: data.pid, contentData: []});
                        channelsData['id' + cid] = {};
                        //以不同的键值存储数据
                        channelsData['id' + cid].list = data.list;
                        channelsData['id' + cid].title = data.title;
                    //若传的是字符串，则直接请求分页接口
                    } else {
                        //合并分页数据
                        let listData=[];
                        if (channelsData['id' + cid].list){
                            listData =channelsData['id' + cid].list;
                        }
                        data.list.forEach(function(item,i){
                            listData.push(item);
                        })
                        //将值写入对应的键值
                        channelsData['id' + cid].list = listData;
                        channelsData['id' + cid].title = data.title;
                    }
                    //更新当前栏目下一页的接口
                    channelsData['id' + cid].nextPage = data.nextPage;
                    channelsData['id' + cid].id = cid;
                    //指定当前活动列表
                    channelsData['id' + cid].active = 1;
                    //更新栏目键值及数据
                    this.setState({channelsData});
                } else {
                    //请求到的是内容数据
                    this.setState({contentData: data});
                }
                //如果是函数，则回调
                if (callback instanceof Function){
                    callback(this.state);
                }
            })
        }
        //设置保存最近的历史页
        this.pageHistory = (pageHistory) => {
            this.setState({pageHistory});
        }
        //获取数据字节大小
        this.getBytesLength = (str) => {
            if (typeof(str) != "string") {
                str = str.toString();
            }
            var totalLength = 0;
            var charCode;
            for (var i = 0; i < str.length; i++) {
                charCode = str.charCodeAt(i);
                if (charCode < 0x007f) {
                    totalLength++;
                } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                    totalLength += 2;
                } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                    totalLength += 3;
                } else {
                    totalLength += 4;
                }
            }
            return totalLength;
        }
        //操作本地数据库
        //计算时间相隔长度，结果为秒
        this.timeDiff = (time1, time2) => {
            if (time1 && time1 instanceof Date) {
                time1 = time1.getTime();
            }
            if (time2 && time2 instanceof Date) {
                time2 = time2.getTime();
            }
            if (!time1 || (time2 && typeof time2 != "number")) {
                return;
            }
            if (!time2 || typeof time2 != "number") {
                time2 = new Date().getTime();
            }
            return (time2 - time1) / 1000;
        }
        /*  key=$key输出数组，key=$clear清除数据，key!="" && key=$remove移除key (优先$...)
         key!="" && valueType=undefined 获取值
         key!="" && valueType!=undefined 写入值
         key=undefined && valueType=undefined 全部获取
         */
        this.localDB = (key, valueType, databaseType) => {
            let storage = window.localStorage;
            if (databaseType == "session") {
                storage = window.sessionStorage;
            }
            if (valueType == null){
                valueType = undefined;
            }
            let locDB = "";
            if (key === "$key") {
                //以数组输出key值
                locDB = [];
                for (let i = 0; i < storage.length; i++) {
                    locDB.push(storage.key(i));
                }
            } else if (key === "$clear") {
                //清除库，超时或全部清除，以秒计算
                if (typeof(valueType) === "number" && (new Date().getTime() - storage.getItem("lastTime")) / 1000 > valueType) {
                    //超时删除
                    storage.clear();
                } else if (!valueType || typeof(valueType) != "number") {
                    //即刻删除
                    storage.clear();
                }
            } else if (key && valueType === "$remove") {
                //移除对象
                storage.removeItem(key);
            } else if (key && valueType === undefined) {
                //获取值
                locDB = storage.getItem(key) ? storage.getItem(key) : null;
            } else if (!key && valueType === undefined) {
                //获取全部数据
                locDB = storage;
            } else if (key && valueType != undefined) {
                //设置值
                if (this.getBytesLength(JSON.stringify(storage) + valueType) > 1024000 * 4) {
                    //如果总大小超过4M，则清除50%的记录量
                    for (let i = storage.length; i > storage.length - parseInt(storage.length * .5); i--) {
                        storage.removeItem(key(i));
                    }
                }
                storage.setItem(key, valueType);
            }
            //记录最近操作本地库的时间
            storage.setItem("lastTime", new Date().getTime());
            return locDB;
        }
        //请求被点击的导航首屏内容列表数据
        this.requestContentList = (id) => {
            //若已加载首屏数据，则不重新请求
            let stateData = this.state;
            let channelsData=stateData.channelsData;
            //设置导航的当前激活状态
            let mainNav = stateData.mainNav.map( (item) => {
                item.active=0
                if (item.id==id){
                    item.active=1;
                    document.title=item.title;
                }
                return item;
            })
            //更新主导航
            this.updateState.mainNav(mainNav);
            let childNav = stateData.childNav.map( (item) => {
                item.active=0
                if (item.id==id){
                    item.active=1;
                    document.title=item.title;
                }
                return item;
            })
            //更新子导航
            this.updateState.childNav(childNav);

            if (channelsData && channelsData["id"+id]){
                //清除活动列表
                for (var item in channelsData){
                    channelsData[item].active=0;
                }
                //置当前为活动列表
                channelsData["id"+id].active=1;
                //更新已访问的栏目数据
                this.updateState.channelsData(channelsData);
                return ;
            }
            //若未请求过，则请求首屏数据
            this.handleRequestData(["channels", id]);
        }
    }

    componentWillMount() {
        //超过1小时未访问，则清空本地数据库，重新记录
        this.localDB("$clear", 3600);
        //预先请求本地导航信息
        let localData = this.localDB("home") ? JSON.parse(this.localDB("home")) : '';
        if (localData) {
            //缓存时间与当前时间未超出指定值，则直接读取本地数据
            if (localData.lastTime && (this.timeDiff(localData.lastTime) < 60*60)) {    //1小时内
                this.setState({
                    mainNav: localData.mainNav,
                    childNav: localData.childNav
                });
                return;
            }
        }
        //远程请求导航信息
        this.handleAjax({
            url: Config.dataUrl.entry,
        }, (data) => {
            var mainid = data.mainid;
            var childNav = [];
            var mainNav = data.list.filter((item, i) => {
                if (item.pid == mainid) {
                    return true;
                } else {
                    childNav.push(item);
                }
            });
            this.setState({mainNav, childNav});
            //转成字符串保存到本地库
            localData = JSON.stringify({
                mainNav,
                childNav,
                lastTime: new Date().getTime()
            });
            this.localDB("home", localData, "session");
        })
    }
    render() {
        let data = this.state;
        return (
            <div>
                {this.props.children && React.cloneElement(this.props.children, {
                    mainNav: data.mainNav,
                    childNav: data.childNav,
                    nextPage: data.nextPage,
                    channelId: data.channelId,
                    channelPId: data.channelPId,
                    channelsData: data.channelsData,
                    listData: data.listData,
                    contentData: data.contentData,
                    pageHistory: data.pageHistory,
                    documentTitle:data.documentTitle,
                    updateState: this.updateState,
                    requestData: this.handleRequestData,
                    onPageHistory: this.pageHistory,
                    requestContentList:this.requestContentList,
                    localDB: this.localDB,
                    timeDiff:this.timeDiff
                })}
            </div>
        )
    }
}
;
export default App;