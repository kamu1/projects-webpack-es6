import React ,{Component} from 'react';
import {Router,Link} from 'react-router';
import TabNavigation from '../tabNavigation/index.jsx';
import ContentInfo from './contentInfo.jsx';

class Content extends Component {
    componentWillMount(){
        let props=this.props;
        if (props.routeParams) {
            let hash = window.location.hash,
                cid = props.routeParams.channelId,
                id = props.routeParams.id;
            //若hash值存在ID且并非后退，则请求，保证直接进入也可读取
            if (hash.indexOf("/content/") >= 0 && cid && id && props.pageHistory!="content" + JSON.stringify(props.routeParams)) {
                //缓存时间与当前时间未超出指定值，则直接读取本地数据
                let localData = props.localDB("content_" + id,null , "session");
                localData = localData ? JSON.parse(localData) : "";
                if (localData){
                    if (localData.lastTime && (props.timeDiff(localData.lastTime) < 60*10)) {     //10分钟内
                        //props.updateState.contentData(localData.contentData);
                        //return ;
                    }
                }
                props.requestData(["contents", cid, id], (data) =>{
                    //将数据存到本地
                    props.localDB("content_" + id, JSON.stringify({
                        contentData: data.contentData,
                        lastTime: new Date().getTime()
                    }),"session");
                });
            }
        }
    }
    componentWillUnmount(){
        let props = this.props;
        let history =props.routeParams;
        history.type="content";
        history.title=document.title;
        //记录此页为上一个历史页，防止后退时重新请求接口
        props.onPageHistory(JSON.stringify(history));
        document.title=props.documentTitle;
    }
    render(){
        let props=this.props;
        return (
            <div>
                <ContentInfo
                    documentTitle={props.documentTitle}
                    contentData={props.contentData}
                    updateState={props.updateState}
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
                />
            </div>
        )
    }
}

export default Content;