import React ,{Component} from 'react';
import {Router,Link} from 'react-router';
import Header from '../header/index.jsx';
import ContentList from '../content/contentList.jsx';

class Channel extends Component {
    componentWillMount() {
        let props = this.props;
        if (props.routeParams) {
            let hash = window.location.hash,
                pid = props.routeParams.parentId,
                id = props.routeParams.id;
            //如果不是后退记录的状态值，则重新请求数据
            if (hash.indexOf("/channel/") >= 0 && pid && id && props.pageHistory != "channel" + JSON.stringify(props.routeParams)) {
                //去掉注释 栏目内容列表数据启用本地存储
                //缓存时间与当前时间未超出指定值，则直接读取本地数据
                //let localData = props.localDB("channelsList",null , "local");
                //localData = localData ? JSON.parse(localData) : "";
                //if (localData){
                //    //判断所有栏目最后请求时间
                //    if (localData.lastTime && (props.timeDiff(localData.lastTime) < 120)) {     //总2分钟内
                //        if (localData.channelsData['id'+id]){
                //            let keyId=localData.channelsData['id'+id]
                //            if (keyId.lastTime && props.timeDiff(keyId.lastTime) < 60){       //子1分钟内
                //                props.updateState.channelsData(localData.channelsData);
                //                return ;
                //            }
                //        }
                //    }
                //}
                this.props.requestData(["channels", id], (data) =>{
                    //将数据存到本地
                    //let channelsData = props.channelsData;
                    //channelsData["id"+id].list=data.listData;
                    //channelsData["id"+id].lastTime=new Date().getTime();
                    //props.localDB("channelsList", JSON.stringify({
                    //    channelsData: channelsData,
                    //    lastTime: new Date().getTime()
                    //}),"local");
                });
            }
        }
    }
    componentWillUnmount() {
        let props = this.props;
        props.updateState.documentTitle(document.title)
        let history =props.routeParams;
        history.type="channel";
        history.title=document.title;
        //记录此页为上一个历史页，防止后退时重新请求接口
        props.onPageHistory(JSON.stringify(history));
    }
    render() {
        let props = this.props;
        return (
            <div>
                <Header
                    documentTitle={props.documentTitle}
                    mainNav={props.mainNav}
                    childNav={props.childNav}
                    requestData={props.requestData}
                    nextPage={props.nextPage}
                    channelId={props.channelId}
                    channelPId={props.channelPId}
                    channelsData={props.channelsData}
                    localDB={props.localDB}
                    updateState={props.updateState}
                    requestContentList={props.requestContentList}
                    backBtn="hide"
                />
                <ContentList
                    documentTitle={props.documentTitle}
                    channelId={props.channelId}
                    channelPId={props.channelPId}
                    channelsData={props.channelsData}
                    listData={props.listData}
                    requestData={props.requestData}
                />
            </div>
        )
    }
}

export default Channel;