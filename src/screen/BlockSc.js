import React, { Component } from "react";
// common component
import {
    Header,
    Text,
} from "native-base";
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Alert,
    Picker,
    RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {
    getBlocks,
    blocks,
} from './../utils/UserUtils';
import {styles} from '../css/css_setting';
import {NetmarbleL, NetmarbleM} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class BlockSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing:false,
            refreshTime:false,
            refreshButton:false,
            option:"block",
            modalVisible:false,
            update: false,
            updateFunction: () => this.setState({update:!this.state.update}),
            data: [],
            search: null
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({
            data: blocks
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    search = () => {
        let serachCheck;

        if(this.state.search == null)
        {
            Alert.alert(
                translate('error'),
                translate('msg_search_key_not_found'),
                [{text: translate('ok')}]
            );
        }
        else
        {
            serachCheck = blocks.filter((v) => v.targetDisplayName.indexOf(this.state.search) !== -1) 
            this.setState({
                data:serachCheck
            });

            if(serachCheck.length == 0)
            {
                Alert.alert(
                    translate('error'),
                    translate('msg_no_search_results'),
                    [{text: translate('ok')}]
                );
            }
        }
    }

    flist() {
        return <FlatList
            style={styles.list}
            data={this.state.data}
            renderItem={({item}) => 
                <TouchableOpacity
                    onPress={()=> Actions.currentScene == "blockSc" ? Actions.userDetail({userId:item.targetUserId, option:"block"}) : {}}
                    style={{padding:"5%",borderWidth:1,borderColor:styles.mainColor.color,marginLeft:"5%",marginRight:"5%",marginTop:"3%",marginBottom:"3%"}}
                >
                    <View style={{flexDirection:"row",width:"100%"}}>
                        <NetmarbleL style={[styles.mainColor, {width:"63%"}]}>
                            {item.targetDisplayName}
                        </NetmarbleL>
                        <NetmarbleL style={[styles.mainColor, {width:"37%"}]}>
                            {item.created?.substring(0,10)}
                        </NetmarbleL>
                    </View>
                </TouchableOpacity>
            }
        />
    }

    reset() {
        if(this.state.refreshTime == false)
        {
            this.setState({
                refreshTime: true,
                modalVisible: true
            });

            setTimeout(() => {
                this.setState({
                    refreshTime: false
                });
            }, 5000);
            
            Promise.all([getBlocks(this.state)])
            .then(() => {
                this.setState({
                    modalVisible : false,
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
            this.state.refreshButton = true;
            this.state.modalVisible = true;
            this.setState({
                refreshTime: true,
                refreshButton: true,
                modalVisible: true
            });
            setTimeout(() => {
                this.setState({
                    refreshTime: false
                });
            }, 5000);

            let promise;

            promise = Promise.all([getBlocks(this.state),getAgainst(this.state)]);
            promise.done(() => {
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
                this.setState({
                    modalVisible : false,
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
            <View style={[styles.mainBackground,{flex:1}]}>
                <View style={styles.logo}>
                    <Icon
					onPress={()=>Actions.pop()}
					name="chevron-left" size={25} style={{color:"white"}}/>
                    <NetmarbleM style={{color:"white"}}>{translate('block_manage')}</NetmarbleM>
                    {this.state.refreshButton == false ?
                    <Icon
                    onPress={this.resetButton.bind(this)}
                    name="cycle" size={20} style={{color:"white"}}
                    />
                    :
                    <ActivityIndicator size={20} color="white"/>
                    }
                </View>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.reset.bind(this)}
                            refreshing={this.state.refreshing}
                        />
                    }
                >
                    <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:"5%",marginRight:"5%"}}>
						<View style={{borderBottomWidth:1,width:"100%",borderColor: styles.mainColor.color, flexDirection:"row",justifyContent:"space-between",marginTop:"5%",marginBottom:"5%"}}>
							<TextInput 
								value={this.state.search}
								onChangeText={(text) => this.setState({search:text})}
								onSubmitEditing={this.search}
								placeholder={translate('name_search')}
                                placeholderTextColor={styles.mainColor.color}
								style={{width:"80%",height:50,fontFamily:"NetmarbleL",color:styles.mainColor.color}}/>
							<Icon 
								onPress={this.search}
								name="magnifying-glass" size={25} style={{marginTop:15,color:styles.mainColor.color}}/>
						</View>
					</View>
                    {this.flist()}
                </ScrollView>
                <Modal
                isVisible={this.state.modalVisible}>
                    <ActivityIndicator size={100}/>
                </Modal>
            </View>
        );
    }
}