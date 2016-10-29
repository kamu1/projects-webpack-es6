import React, {Component} from 'react';
import Header from '../header/index.jsx';
import $ from "webpack-zepto";
//window.Hammer =require('react-hammerjs');
import '../../../../public/plugin/swiper/swiper.min.css'
import Swiper from '../../../../public/plugin/swiper/swiper.min.js';

class ContentInfo extends Component {
    constructor(props){
        super(props);
        //滑动功能
        this.onSwiper = () =>{
            var swiper = new Swiper('.swiper-content', {
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

    render(){
        let props = this.props,
            data = this.props.contentData,
            imgs = [];
        if (data.imagesList instanceof Array){
            imgs = data.imagesList.filter((item, i) => {
                return item ? true : false;
            });
        }
        if (data.title){
            document.title = data.title;
        }
        //<Hammer
        //    onSwipe={this.onSwipe}
        //    options={{
        //           recognizers: {
        //              swipe: { enable: true,direction: 30 }
        //              //none/1,left/2,right/4,up/8/down/16,horizontal/6,vertical/24/all30
        //           }
        //        }}>
        //      <div>....</div>
        //</Hammer>
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
                    navMenu="hide"
                />
                <div className="swiper-container swiper-content">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <div style={{margin:"10px 10px 30px 10px",lineHeight:"1.8em"}}>
                                <h3 style={{textAlign:"center"}}><span dangerouslySetInnerHTML={{__html: data.title}} style={{textAlign:"left",display:"inline-block"}}></span></h3>
                                <h6 className="n" dangerouslySetInnerHTML={{__html: data.subTitle}} style={{color:"#666",borderBottom:"1px solid #eee",paddingBottom:5}}></h6>
                                {imgs.length && (!data.imageGroup || !data.imageGroup.length) ?
                                    <ul className={"n imgs img_" + imgs.length} style={{textAlign:"center"}}>
                                        {imgs.map((item,i) => (
                                            <li dangerouslySetInnerHTML={{__html: item}} style={{marginTop:10}}></li>
                                        ))}
                                    </ul> : ''}
                                {data.imageGroup && data.imageGroup.length ?
                                    <ul className={"n img-grounp img_" + data.imageGroup.length} style={{textAlign:"center"}}>
                                        {data.imageGroup.map((item,i) => (
                                            <li style={{marginTop:10}}>
                                                <div dangerouslySetInnerHTML={{__html: item.image}}></div>
                                                {item.title ?
                                                    <h4 className="n" style={{marginTop:10,fontSize:"1em"}}>{item.title}</h4> : ''}
                                                {item.content ?
                                                    <div>
                                                        <p className="n" style={{display:"inline-block",textAlign:"left",fontSize:"0.8em",color:"#666"}}>{item.content}</p>
                                                    </div> : '' }
                                            </li>

                                        ))}
                                    </ul> : ''}
                                <div dangerouslySetInnerHTML={{__html: data.content}}></div>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-scrollbar"></div>
                </div>
            </div>
        )
    }
}

export default ContentInfo;