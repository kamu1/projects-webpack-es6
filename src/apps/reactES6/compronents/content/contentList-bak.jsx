import React,{Component} from 'react';
import {Link} from 'react-router';

//栏目组件
class ContentList extends Component{
    render(){
        let props = this.props;
        var channels=[];
        //将对象转成数组，使于遍历
        for (var item in props.channelsData){
            channels.push(props.channelsData[item]);
        }
        //console.log(channels)
        //遍历组件，实现嵌套循环
        let channelsList = channels.map((item,i) => (
            <ItemList
                index={i}
                id={item.id}
                item={item}
                channelId={props.channelId}
                requestData={props.requestData}
            />
        ));
        return (
            <div>
                <div>
                    {channelsList}
                </div>
            </div>
        )
    }
}
//列表组件
class  ItemList extends Component {
    //下一页
    onNextPage(ev,url,id){
        let props = this.props;
        //console.log(this.props)
        if (url){
            props.requestData(url, id);
        }
    }
    render(){
        let props=this.props;
        let itemList=[];
        if (props.item.list){
            //遍历组件，实现嵌套循环
            itemList = props.item.list.map((item,i) => (
                <ItemRow
                    index={props.index + '' + i}
                    item={item}
                />
            ))
        }
        return (
            <div style={{display:props.item.active ? "block" : "none"}} key={'channelsList'+props.index}>
                <h2>{props.item.title}{props.item.active}</h2>
                <ol>
                    {itemList}
                </ol>
                {props.item.nextPage ? <div onClick={(ev,url,id) => {this.onNextPage(ev, props.item.nextPage, props.id)}}>下一页</div> : ''}
            </div>
        )
    }
}
//行组件
class ItemRow extends Component {
    render(){
        let props = this.props;

        return (
            <li key={'contentList'+props.index}>
                <Link to={`/content/${props.item.pid}/${props.item.id}`} activeClassName="active">
                    <span dangerouslySetInnerHTML={{__html: props.item.title}}></span>
                </Link>
            </li>
        )
    }
}

export default ContentList;