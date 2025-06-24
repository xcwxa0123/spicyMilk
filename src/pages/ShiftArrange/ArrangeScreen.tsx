import { ImageBackground, Image, Text, View, StyleSheet, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useEffect } from 'react';
import { getNavigation } from '@tools/naviHook'
import { Button } from '@react-navigation/elements';
import { RouteList } from '@tools/route'
import { initTable } from '@tools/initTable'
import { useLayoutEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { useState } from 'react';

const backgroundImage = require('@assets/gongfeng-bg.png');
const editImage = require('@assets/edit.png');
const okImage = require('@assets/ok.png');

const getIconImage = (index: number) => {
    const imgList: Record<number, any> = {
        0: require('@assets/m2.png'),
        1: require('@assets/m1.png'),
        2: require('@assets/m6.png'),
        3: require('@assets/m16.png'),
    }
    return imgList[index] || require('@assets/m1.png')
}

type ASRouteParams = { route: RouteProp<RouteList, 'ArrangeScreen'> }

export function ArrangeScreen({ route }: ASRouteParams) {
    // initTable()
    const [modalVisible, setModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    console.log('让我康康========>', route)
    const navigation = getNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable 
                    style={ ({ pressed }) => [styles.rbtn, pressed && styles.rbtnActive] }
                    onPress={() => setIsEdit(!isEdit)}
                >
                    {
                        !isEdit? 
                        <Image source={ editImage } style={ styles.editImg }></Image> : 
                        <Image source={ okImage } style={ styles.okImg }></Image>
                    }
                </Pressable>
            ),
            title: '',
            headerStyle: {
                backgroundColor: 'rgba(254, 251, 244, 0.3)',
            },
            headerTintColor: '#rgba(0, 0, 0, 1)', // 文字/图标颜色
            headerShadowVisible: false,
        });
    }, [navigation, isEdit]);
    
    const arrangeItemList = [
        {
            itemName: '唯那：',
            type: 1,
            backgroundColor: 'rgba(248, 245, 236, 1)'
        },
        {
            itemName: '木鱼',
            type: 2,
            backgroundColor: 'rgba(246, 246, 238, 1)'
        },
        {
            itemName: '引磬',
            type: 3,
            backgroundColor: 'rgba(255, 248, 240, 1)'
        },
        {
            itemName: '小木鱼',
            type: 4,
            backgroundColor: 'rgba(239, 239, 239, 1)'
        },
        {
            itemName: '铃鼓',
            type: 5,
            backgroundColor: 'rgba(239, 239, 239, 1)'
        },
        {
            itemName: '出食',
            type: 6,
            backgroundColor: 'rgba(239, 239, 239, 1)'
        }
    ]

    return (
        <ImageBackground source={ backgroundImage } resizeMode='cover' style={ styles.ibg }>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                    // setIsEdit(!isEdit);
                }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={true} // 隐藏滚动条（可选）
                >
                    {/* <View style={ modalStyles.modalView }></View> */}
                    <View style={ modalStyles.modalView }>
                        <View style={ modalStyles.selectView }></View>
                    </View>
                </ScrollView>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={dateModalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setDateModalVisible(!dateModalVisible);
                }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={true} // 隐藏滚动条（可选）
                >
                    {/* <View style={ modalStyles.modalView }></View> */}
                    <View style={ modalStyles.dateModalView }>
                        <View style={ modalStyles.dateSelectView }></View>
                    </View>
                </ScrollView>
            </Modal>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false} // 隐藏滚动条（可选）
            >
                <View style={ styles.topBanner }>
                    <Text style={ styles.topText }>早晚课排班</Text>
                    {
                        isEdit?
                            (<Pressable
                                style={ ({ pressed }) => [styles.datePA, styles.datePAEdit, pressed && styles.datePAActive] }
                                onPress={() => setDateModalVisible(true)}
                            >
                                <Text style={ styles.dateText }>2025.6.24-2025.6.26</Text>
                            </Pressable>)
                            :
                            (<Pressable style={ styles.datePA }>
                                <Text style={ styles.dateText }>2025.6.24-2025.6.26</Text>
                            </Pressable>)
                    }
                </View>
                {
                    !isEdit ? 
                        (<Text style={ [styles.secondText, { height: 30 }] }>       点击右上角编辑按钮进入编辑模式</Text>)
                    :
                        (<Text style={ styles.secondText }>     点击日期进行日期选择，点击职位卡片进行人员选择，选择完毕后按完成按钮退出编辑模式</Text>)
                }
                
                <View style={ styles.samList }>
                    {
                        arrangeItemList.map((item, index) => (
                            isEdit?
                            (<Pressable
                                style={ ({ pressed }) => [styles.samItem, styles.samItemEdit, { backgroundColor: item.backgroundColor }, pressed && styles.samItemActive] }
                                key={ index }
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={ styles.samItemText }>| { index + 1 } { item.itemName }</Text>
                                <Image source={getIconImage(index)} resizeMode="contain" style={ styles.samItemIcon }></Image>
                            </Pressable>)
                            :
                            (<Pressable style={ [styles.samItem, { backgroundColor: item.backgroundColor }] } key={ index }>
                                <Text style={ styles.samItemText }>| { index + 1 } { item.itemName }</Text>
                                <Image source={getIconImage(index)} resizeMode="contain" style={ styles.samItemIcon }></Image>
                            </Pressable>)
                        ))
                    }
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    ibg: {
        overflow: 'scroll',
        flex: 1
    },
    scrollContainer: {
        flexGrow: 1, // 确保内容不足时也能填满空间
    },
    topBanner: {
        // height: 350,
        // flexDirection: 'row',
    },
    topText: {
        flex: 1,
        padding: 20,
        paddingBottom: 0,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 40,
        height: 70,
        // borderStyle: 'solid',
        // borderWidth: 1,
    },
    datePA: {
        // flex: 3,
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 30,
        marginTop: 0,
        marginLeft: 40,
        padding: 20,
    },
    datePAEdit: {
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(216, 213, 206, 0.3)',
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.1)'
    },
    datePAActive: {
        boxShadow: 'none',
        position: 'relative',
        top: 3,
        left: 2
    },
    dateText: {
        // flex: 1,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 30,
        // textAlignVertical: 'center',
    },
    secondText: {
        flex: 2,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        // marginTop: 20,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 20
    },
    samList: {
        flex: 7,
    },
    samItem: {
        // flex: 3,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20,
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(216, 213, 206, 1)',
    },
    samItemEdit: {
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.1)'
    },
    samItemActive: {
        boxShadow: 'none',
        position: 'relative',
        top: 3,
        left: 2
    },
    samItemIcon: {
        aspectRatio: 1,
        width: '20%',
        marginTop: 15,
        marginBottom: 15,
        marginRight: 20
        
    },
    samItemText: {
        paddingRight: 50,
        textAlignVertical: 'center',
        height: 80,
        marginHorizontal: 30,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 30,
        textAlign: 'left'
    },
    rbtn: {
        aspectRatio: 1,
        width: '20%',
        // margin: 20,
        marginRight: 0,
        marginLeft: 120,
        height: 'auto',
        position: 'relative',
        // right: -20,
        borderRadius: 10,
        // borderStyle: 'solid',
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',

        // borderColor: 'rgba(216, 213, 206, 1)',
        // boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.1)'

    },
    rbtnActive: {
        boxShadow: 'none',
        position: 'relative',
        top: 3,
        right: 2,
    },
    editImg: {
        width: '100%',
        resizeMode: 'contain',
        
    },
    okImg: {
        width: '100%',
        resizeMode: 'contain',
        // aspectRatio: 1,
        // width: '100%'
    }
});

const modalStyles = StyleSheet.create({
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    selectView: {
        flex: 1,
        margin: 40,
        width: '90%',
        backgroundColor: 'rgba(112, 54, 54, 0.9)'
    },
    dateModalView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'rgba(250, 24, 24, 0.6)'
    },
    dateSelectView: {
        flex: 1,
        margin: 40,
        width: '90%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
    }
})

// 