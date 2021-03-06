import React, { Component } from "react";
// common component
import {
    Text,
} from "native-base"
import {
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    View,
    TextInput,
    Dimensions,
    Alert,
    ActivityIndicator,
    ToastAndroid,
    AsyncStorage
} from "react-native"
import Icon from "react-native-vector-icons/Entypo"
import { Actions } from 'react-native-router-flux'
import Carousel from 'react-native-snap-carousel'
import Modal from 'react-native-modal';
import {MapTags, updateFavoriteMap, FavoriteWorld, drawModal} from '../utils/MapUtils'
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils'
import {styles} from '../css/css_setting';
import {NetmarbleL,NetmarbleM} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class MapListSc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing:false,
            refreshTime:false,
            refreshButton:false,
            modalVisible:true,
            mapList: [],
            index: 0,
            mapCount: 10,
            search:'',
            tag: 'new',
            display : false,
            toggleModal : (t = null) => this.setState({display : t ? t : !this.state.display}),
            update : false,
            updateFunction : () => this.setState({update : !this.state.update}),
            // 업데이트용 tmp 변수
            tmp : () => this.setState({tmp:null}),
            fake_image: "none",
            high_image: "none",
        };
    }

    drawMapTag = () => 
        [...MapTags.keys()].map((key, idx) => 
            <NetmarbleL
            key={idx} style={this.state.tag == key ? styles.mapSelectTag : styles.mapTag} 
            onPress={() => {
                this.searchTagMap(key);
                this._carousel.snapToItem(0,true,true);
            }}>{key}</NetmarbleL>
        )

    searchMapList = (callback) => 
        fetch(`https://api.vrchat.cloud/api/1/worlds?search=${this.state.search}`, VRChatAPIGet)
        .then((response) =>  response.json())
        .then((responseJson) => {
            if(!responseJson.error){
                this.setState({
                    mapList: responseJson
                }, () => callback())
            }
        })


    UNSAFE_componentWillMount() {
        this.searchTagMap();
        AsyncStorage.getItem("user_high_image",(err,value)=>{
            this.setState({
                high_image: value
            });
        });
        AsyncStorage.getItem("user_fake_image",(err,value)=>{
            this.setState({
                fake_image: value
            });
        });
    }

    componentWillUnmount() {
    }
    componentDidMount() {
    }
    
    searchMap = () => {
        if(this.state.search == null || this.state.search == "")
        {
            Alert.alert(
                translate('error'),
                translate('msg_search_key_not_found'),
                [{text: translate('ok'), onPress: () => null}]
            )
        }
        else
        {
            this.searchMapList(() => {
                    if(this.state.mapCount == 0)
                    {
                        Alert.alert(
                            translate('error'),
                            translate('msg_no_search_results'),
                            [{text: translate('ok'), onPress: () => null}]
                        );
                    }
                    else
                    {
                        this.forceUpdate();
                    }
                }
            )
        }
    }
    
    searchTagMap = (tagName = this.state.tag, idx = this.state.index) => {
        // 리로드 모달 보여주기
        if(!MapTags.has(tagName)) return
        let isSameTag = this.state.tag == tagName
        fetch(`https://api.vrchat.cloud/api/1/worlds?tag=${MapTags.get(tagName)}&sort=_updated_at&offset=${idx * this.state.mapCount}`, VRChatAPIGet)
        .then((response) =>  response.json())
        .then((responseJson) => {
            if(!responseJson.error){
                this.setState((prevState, prevProps) => {
                    return {
                        mapList: isSameTag ? [...prevState.mapList, ...responseJson] : responseJson,
                        search: '',
                        tag: tagName,
                        index : idx,
                        modalVisible: false
                    }
                });
            }
        })
    }

    reset() {
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.searchTagMap()])
            .then(() => {
                this.setState({
                    modalVisible : false
                });
            });

            this.setState({
                refreshing:false,
                search:null
            });
        }
        else
        {
            ToastAndroid.show(translate('msg_refresh_time'), ToastAndroid.SHORT);
        }
    }

    resetButton() {
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalVisible = true;
            this.state.refreshButton = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.searchTagMap()])
            .then(() => {
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
                this.setState({
                    modalVisible : false
                });
            });

            this.setState({
                refreshing:false,
                search:null
            });
        }
        else
        {
            ToastAndroid.show(translate('msg_refresh_time'), ToastAndroid.SHORT);
        }
    }

    render() {
        return (
            <ScrollView
            style={styles.mainBackground}
            refreshControl={
                <RefreshControl
                    onRefresh={this.reset.bind(this)}
                    refreshing={this.state.refreshing}
                />
            }>
                <View style={styles.logo}>
                    <Icon
					onPress={()=>Actions.pop()}
					name="chevron-left" size={25} style={{color:"white"}}/>
                    <NetmarbleM style={{color:"white"}}>{translate('world_list')}</NetmarbleM>
                    {this.state.refreshButton == false ?
                    <Icon
                    onPress={this.resetButton.bind(this)}
                    name="cycle" size={20} style={{color:"white"}}
                    />
                    :
                    <ActivityIndicator size={20} color="white"/>
                    }
                </View>
                <View style={styles.textView}>
                    <View style={styles.textBox}>
                        <TextInput 
                            value={this.state.search}
                            onChangeText={(text) => this.setState({search:text})}
                            onSubmitEditing={this.searchMap}
                            placeholder={translate('search_map')}
                            style={{width:"90%",height:50,fontFamily:"NetmarbleL"}}/>
                        <Icon 
                            onPress={() => this.searchMap}
                            name="magnifying-glass" size={25} style={{marginTop:5,color:"#3a4a6d"}}/>
                    </View>
                </View>
                <View style={{alignItems:"center",marginTop:"10%"}}>
                    <ScrollView
                    horizontal
                    style={{
                        width:"94%",
                        minHeight:50,
                        maxHeight:50,
                        flexDirection:"row",
                        borderColor:"#5a82dc",
                        borderTopWidth:1,
                        borderBottomWidth:1
                    }}>
                    {this.drawMapTag()}
                    </ScrollView>
                </View>

                <View style={{marginTop:"10%",alignItems:"center",height:"100%"}}>
                    <Carousel
                        layout={'default'}
                        ref={(c) => { this._carousel = c; }} 
                        onBeforeSnapToItem={(idx) => {
                            if(idx == this.state.mapList.length - 1){
                                this.searchTagMap(this.state.tag, this.state.index + 1);
                            }
                        }}
                        enableMomentum={"fast"}
                        extraData={this.state}
                        data={this.state.mapList}
                        sliderWidth={parseInt(Dimensions.get('window').width / 100 * 100)}
                        itemWidth={parseInt(Dimensions.get('window').width / 100 * 80)}
                        renderItem={({item}) => 
                            <TouchableOpacity
                                style={styles.worldInfo}
                                onPress={() => {
                                    if(Actions.currentScene == "mapListSc" && item.authorId != this.props.userId)
                                    {
                                        Actions.userDetail({userId:item.authorId, isFriend:false})
                                    }
                                }}>
                                <View>
                                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                                        <View>
                                            <TouchableOpacity
                                                style={styles.worldIcon}
                                                onPress={() => 
                                                updateFavoriteMap(this.state, item, FavoriteWorld.get(item.id))}>
                                                    <Image
                                                    source={
                                                        FavoriteWorld.get(item.id) ?
                                                        require('../css/imgs/favorite_star.png')
                                                        :
                                                        require('../css/imgs/unfavorite_star.png')
                                                    }
                                                    style={{width:30,height:30}}/>
                                            </TouchableOpacity>
                                            <NetmarbleM style={{textAlign:"center"}}>{item.name}</NetmarbleM>
                                            <View>
                                                <Image
                                                    style={{
                                                        width: parseInt(Dimensions.get('window').width / 100 * 72), 
                                                        height: parseInt(Dimensions.get('window').width / 100 * 50),
                                                        borderRadius:5,
                                                        marginTop:"5%",
                                                        marginBottom:"5%",
                                                        resizeMode:"contain"
                                                    }}
                                                    source={
                                                        this.state.high_image == "check"
                                                        ?
                                                        VRChatImage(item.imageUrl)
                                                        :
                                                        this.state.fake_image == "check"
                                                        ?
                                                        require("../css/imgs/data_safe.png")
                                                        :
                                                        VRChatImage(item.thumbnailImageUrl)
                                                    }
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <NetmarbleL style={{lineHeight:30}}>
                                            {translate('creator')} : {item.authorName}{"\n"}
                                            {translate('all')} : {item.occupants}{translate('people_count')}{"\n"}
                                            {translate('update_date')} : {item.updated_at?.substring(0, 10)}{"\n"}
                                        </NetmarbleL> 
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </View>
                {drawModal(this.state)}
                <Modal
                isVisible={this.state.modalVisible}>
                    <ActivityIndicator size={100}/>
                </Modal>
            </ScrollView>
        );
    }
}