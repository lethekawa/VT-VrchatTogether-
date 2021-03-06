import React, { Component } from "react";
// common component
import {
    Button,
    Text,
} from "native-base";
import {
    Image,
    ScrollView,
    RefreshControl,
    View,
    Alert,
    ToastAndroid,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    Switch,
    Linking,
    AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Modal from 'react-native-modal';
import { Actions } from "react-native-router-flux";
import {styles, getUserCssOption} from '../css/css_setting';
import {NetmarbleB,NetmarbleL,Komako} from '../utils/CssUtils';
import {translate,userLang,getLanguage,setLanguage} from '../translate/TranslateUtils';
import {VRChatAPIPut} from '../utils/ApiUtils';
import RNRestart from 'react-native-restart'; 

export default class Option extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fakeImage: false,
            highImage: false,
            langCheck: false,
            darkMode: false,
        };
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem("user_fake_image",(err,value)=>{
            if(value == "check")
            {
                this.setState({
                    fakeImage: true
                });
            }
        });
        AsyncStorage.getItem("user_high_image",(err,value)=>{
            if(value == "check")
            {
                this.setState({
                    highImage: true
                });
            }
        });
        AsyncStorage.getItem("user_dark_mode",(err,value)=>{
            if(value == "check")
            {
                this.setState({
                    darkMode: true
                });
            }
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    // 로그아웃 처리
    logout = () => {
        Alert.alert(
            translate('information'),
            translate('msg_logout'),
            [
                {text: translate('ok'), onPress: () => {
                    fetch(`https://api.vrchat.cloud/api/1/logout`, VRChatAPIPut)
                    .then((response) => response.json())
                    .then(() => {
                        AsyncStorage.removeItem("storage_pw");
                        Actions.replace("loginSc");
                    });
                }},
                {text: translate('cancel')}
            ]
        );
    }

    setFakeImage() {
        if(!this.state.fakeImage == true)
        {
            AsyncStorage.removeItem("user_fake_image");
            AsyncStorage.setItem("user_fake_image","check");
            AsyncStorage.removeItem("user_high_image");
            AsyncStorage.setItem("user_high_image","none");
            this.setState({
                fakeImage: !this.state.fakeImage,
                highImage: false
            });
        }
        else
        {
            AsyncStorage.removeItem("user_fake_image");
            AsyncStorage.setItem("user_fake_image","none");
            this.setState({
                fakeImage: !this.state.fakeImage
            });
        }
    }

    setHighImage() {
        if(!this.state.highImage == true)
        {
            AsyncStorage.removeItem("user_high_image");
            AsyncStorage.setItem("user_high_image","check");
            AsyncStorage.removeItem("user_fake_image");
            AsyncStorage.setItem("user_fake_image","none");
            this.setState({
                highImage: !this.state.highImage,
                fakeImage: false
            });
        }
        else
        {
            AsyncStorage.removeItem("user_high_image");
            AsyncStorage.setItem("user_high_image","none");
            this.setState({
                highImage: !this.state.highImage
            });
        }
    }

    setDarkMode() {
        this.setState((state)=>{
            if(!state.darkMode == true)
            {
                AsyncStorage.removeItem("user_dark_mode");
                AsyncStorage.setItem("user_dark_mode","check");
            }
            else
            {
                AsyncStorage.removeItem("user_dark_mode");
                AsyncStorage.setItem("user_dark_mode","none");
            }
            return {
                darkMode: !state.darkMode,
            }
        });
        getUserCssOption();
        this.props.changeUpdate();
        Alert.alert(translate('information'), translate('dark_mode_info'),
        [
          {text: translate('ok'), onPress: () => RNRestart.Restart()},
        ],
        {cancelable: false}
        )
    }

    langSelect(lang) {
        userLang(lang);
        setLanguage(lang)
        this.setState({
            langCheck: false
        });
        this.props.changeUpdate();
    }
    
    render() {
        return (
            <ScrollView style={[styles.mainBackground,{flex:1}]}>
                <View style={[styles.logo,{justifyContent:"center"}]}>
                    <Icon
                    onPress={()=>Actions.pop()}
                    name="chevron-left" size={25}
                    style={{color:"white",position:"absolute",left:15,top:10}}/>
                    <NetmarbleB style={{color:"white"}}>{translate('option')}</NetmarbleB>
                </View>
                <View style={styles.userOption}>
                    <View style={styles.userOptionBox}>
                        <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={()=>this.setFakeImage()}
                        thumbColor={"#f4f3f4"}
                        value={this.state.fakeImage}/>
                        <NetmarbleL style={styles.optionTitle}>{translate('fake_image')}</NetmarbleL>
                    </View>
                    <View style={styles.userOptionBox}>
                        <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={()=>this.setHighImage()}
                        thumbColor={"#f4f3f4"}
                        value={this.state.highImage}/>
                        <NetmarbleL style={styles.optionTitle}>{translate('high_image')}</NetmarbleL>
                    </View>
                    <View style={styles.userOptionBox}>
                        <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={()=>this.setDarkMode()}
                        thumbColor={"#f4f3f4"}
                        value={this.state.darkMode}/>
                        <NetmarbleL style={styles.optionTitle}>{translate('dark_mode')}</NetmarbleL>
                    </View>
                </View>
                <View style={styles.setting}>
                    <TouchableOpacity
                    onPress={()=>{this.setState({langCheck:true})}}>
                        <View style={styles.settingMenu}>
                            <Icon name={"language"} size={25} style={styles.settingMenuImage} />
                            <NetmarbleL style={styles.optionTitle}>{translate('lang_option')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>Linking.openURL("http://www.vrct.kr")}>
                        <View style={styles.settingMenu}>
                            <Icon name={"browser"} size={25} style={styles.settingMenuImage} />
                            <NetmarbleL style={styles.optionTitle}>{translate('homepage')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>this.logout()}>
                        <View style={styles.settingMenu}>
                            <Icon name={"log-out"} size={25} style={styles.settingMenuImage} />
                            <NetmarbleL style={styles.optionTitle}>{translate('logout')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                    <View style={{borderColor:"#4d221e1f",borderWidth:1,alignItems:"center",padding:25,marginTop:40}}>
                        <View style={{borderColor:"#b4b4b4",borderBottomWidth:1,alignItems:"center",paddingBottom:20,width:"100%"}}>
                            <NetmarbleL style={styles.optionTitle}>{translate('dev_info')}</NetmarbleL>
                        </View>
                        <View style={{alignItems:"center"}}>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('pm')}</NetmarbleL>
                            <Komako style={styles.optionTitle}>Aboa (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> Aboa#9076)</Komako>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('developer')}</NetmarbleL>
                            <Komako style={styles.optionTitle}>Leth (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> Hana#4158)</Komako>
                            <Komako style={styles.optionTitle}>늦잠 (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> sychoi#4273)</Komako>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('designer')}</NetmarbleL>
                            <Komako style={styles.optionTitle}>세르뀨 (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> 세르뀨#1388)</Komako>
                            <Komako style={styles.optionTitle}>은혜 (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> 은혜#0372)</Komako>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('charater_designer')}</NetmarbleL>
                            <Komako style={styles.optionTitle}>민트실버 (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> 민트실버#1131)</Komako>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('tester')}</NetmarbleL>
                            <Komako style={styles.optionTitle}>Excite / きゆ / 옌딩</Komako>
                        </View>
                    </View>
                </View>
                <Modal
                isVisible={this.state.langCheck}
                onBackButtonPress={()=>this.setState({langCheck:!this.state.langCheck})}
                onBackdropPress={()=>this.setState({langCheck:!this.state.langCheck})}>
                    <View style={{backgroundColor:"#fff",padding:"5%",borderRadius:10}}>
                        <View style={{alignItems:"center"}}>
                            <View style={{flexDirection:"column",width:"100%"}}>
                                <Button
                                onPress={this.langSelect.bind(this,'kr')}
                                style={[styles.requestButton, { borderWidth:0, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>한국어</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'en')}
                                style={[styles.requestButton, { marginTop:10, marginBottom:10, borderWidth:0, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>English</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'jp')}
                                style={[styles.requestButton, { borderWidth:0, marginBottom:10, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>日本語</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'es')}
                                style={[styles.requestButton, { borderWidth:0, marginBottom:10, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>Español</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'br')}
                                style={[styles.requestButton, { borderWidth:0, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>Portugués</NetmarbleB>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}