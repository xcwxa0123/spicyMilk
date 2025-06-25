import { ImageBackground, Image, Text, View, StyleSheet, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useEffect } from 'react';
import { getNavigation } from '@tools/naviHook'
import { Button } from '@react-navigation/elements';
import { RouteList } from '@tools/route'
import { initTable } from '@tools/initTable'
import { useLayoutEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import { useRealm } from '@realm/react';
import { Main, DungeonCategory, TimeLineSum, TimeLine, ArrangePosition, ArrangePeople } from '@tools/zeroExport'

const realm = useRealm()

const getIconImage = (index: number | string) => {
    const imgList: Record<number| string, any> = {
        0: require('@assets/m2.png'),
        1: require('@assets/m1.png'),
        2: require('@assets/m6.png'),
        3: require('@assets/m16.png'),

        'backgroundImage': require('@assets/gongfeng-bg.png'),
        'editImage': require('@assets/edit.png'),
        'okImage': require('@assets/ok.png')
    }
    return imgList[index] || require('@assets/m1.png')
}
type BackStageScreen = { route: RouteProp<RouteList, 'BackStageScreen'> }

export function BackStageScreen({ route }: BackStageScreen) {
    // initTable()
    const [modalVisible, setModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const navigation = getNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: {
                backgroundColor: 'rgba(254, 251, 244, 0.3)',
            },
            headerTintColor: '#rgba(0, 0, 0, 1)', // 文字/图标颜色
            headerShadowVisible: false,
        });
    }, [navigation]);
    
    let arrangeItemList: Array<ArrangePosition> = [
            ArrangePosition.generate('初始化', 999, 0, 'rgba(248, 245, 236, 1)', 0),
            ArrangePosition.generate('新增人员', 999, 1, 'rgba(246, 246, 238, 1)', 0),
            ArrangePosition.generate('新增职位', 999, 2, 'rgba(255, 248, 240, 1)', 0),
            ArrangePosition.generate('清除所有数据', 999, 3, 'rgba(239, 239, 239, 1)', 0)
        ]
    return (
        <ImageBackground source={ getIconImage('backgroundImage') } resizeMode='cover' style={ styles.ibg }>
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
                    <Text style={ styles.topText }>后台管理</Text>
                </View>
                
                <View style={ styles.samList }>
                    {
                        arrangeItemList.map((item: any, index: number) => (
                            <Pressable
                                style={ ({ pressed }) => [styles.samItem, styles.samItemEdit, { backgroundColor: item.backgroundColor }, pressed && styles.samItemActive] }
                                key={ index }
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={ styles.samItemText }>| { index + 1 } { item.positionName }</Text>
                                <Image source={getIconImage(item.imgIndex)} resizeMode="contain" style={ styles.samItemIcon }></Image>
                            </Pressable>
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