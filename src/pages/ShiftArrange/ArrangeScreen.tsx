import { ImageBackground, Image, Text, View, StyleSheet, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useCallback, useEffect, useMemo } from 'react';
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

type ASRouteParams = { route: RouteProp<RouteList, 'ArrangeScreen'> }

export function ArrangeScreen({ route }: ASRouteParams) {
    const navigation = getNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [multipleModalVisible, setMultipleModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [curPeopleSelect, setCurPeopleSelect] = useState(new Array());
    const [isEdit, setIsEdit] = useState(false);


    // 给DB查询做缓存，避免重复调取资源
    const { peopleList, positionList, dataList } = useMemo(() => ({
        positionList : realm.objects('ArrangePosition').filtered('positoinType == $0', route.params.arrangeType),
        peopleList : realm.objects('ArrangePeople'),
        dataList : realm.objects('ArrangeList'),
    }), [realm, route.params.arrangeType])

    // 导航栏加编辑图标
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable 
                    style={ ({ pressed }) => [styles.rbtn, pressed && styles.rbtnActive] }
                    onPress={() => setIsEdit(!isEdit)}
                >
                    <Image source={ isEdit ? getIconImage('okImage') : getIconImage('editImage')} style={ isEdit ? styles.okImg : styles.editImg }></Image>
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
    
    // 给页面显示的datalist和开始结束日期做缓存
    // 
    // const [curStartDate, setCurStartDate] = useState(new Date())
    // const [curEndDate, setCurEndDate] = useState(new Date())
    const { curArrangeDataList, defaultStartDate, defaultEndDate } = useMemo(() => {
        let tempDataList;
        let startDate: Date = new Date();
        let endDate: Date = new Date();
        if(dataList.length){
            startDate = new Date()
            tempDataList = dataList.filtered('positoinType == $0 AND startDate < $1', route.params.arrangeType, startDate).sorted('startDate', true)
            
            const lastDate = tempDataList.at(0)
            startDate = lastDate!['startDate'] as Date
            endDate = lastDate!['endDate'] as Date
            tempDataList = dataList.filtered('positoinType == $0 AND startDate == $1', route.params.arrangeType, startDate).sorted('positionIndex')
            tempDataList = Array.from(tempDataList)
        } else {
            console.log('看看试试==============>', Array.from(positionList))
            // setCurArrangeDataList(Array.from(positionList))
            tempDataList = Array.from(positionList)
        }
        return {
            curArrangeDataList: tempDataList,
            defaultStartDate: startDate,
            defaultEndDate: endDate
        }
    }, [dataList, positionList, route.params.arrangeType])

    const [selectedStartDate, setSelectedCurStartDate] = useState<Date | null>(null)
    const [selectedEndDate, setSelectedCurEndDate] = useState<Date | null>(null)

    const [curStartDate, curEndDate] = selectedStartDate ? [selectedStartDate, selectedEndDate] : [defaultStartDate, defaultEndDate]

    console.log('康康人员列表捏===========>peopleList', peopleList)
    console.log('康康职位列表捏===========>positionList', positionList)
    console.log('康康数据列表捏===========>dataList', dataList)

    console.log('看看curPeopleSelect==========>', curPeopleSelect)

    const openPeopleSelect = useCallback((name: Array<string>) => {
        setModalVisible(true)
        name && setCurPeopleSelect(name)
    }, [])

    // function openPeopleSelect(name: Array<string>) {
    //     setModalVisible(true)
    //     name && setCurPeopleSelect(name)
    // }

    function openMultiPeopleSelect(name: string){

    }

    function openDateSelect() {
        setDateModalVisible(true)
    }


    const peopleSelect = useCallback((item: any) => {
        console.log('看看选了啥=========>item', item)
        // debugger
        setCurPeopleSelect([item.name])
    }, [])

    function multiPeopleSelect(item: any) {
        console.log('看看选了啥=========>item', item)
    } 

    return (
        <ImageBackground source={ getIconImage('backgroundImage') } resizeMode='cover' style={ styles.ibg }>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("单选框关闭");
                    setModalVisible(!modalVisible);
                }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={true} // 隐藏滚动条（可选）
                >
                    {/* 人员选择modal */}
                    <View style={ modalStyles.modalView }>
                        <View style={ modalStyles.selectView }>
                            {
                                peopleList.map((item: any, index: number) => (
                                    <Pressable
                                        style={ ({ pressed }) => [modalStyles.selectItem, styles.samItemEdit, pressed && styles.samItemActive, curPeopleSelect && curPeopleSelect.length && curPeopleSelect.findIndex(name => name == item.name) != -1 ? { backgroundColor: 'rgb(136, 136, 136)' } : {}]}
                                        key={ index }
                                        onPress={ _ => peopleSelect(item) }
                                        disabled={ curPeopleSelect && curPeopleSelect.length && curPeopleSelect.findIndex(name => name == item.name) != -1 ? true : false }
                                    >
                                        <Text style={ modalStyles.selectItemText }>{ item.name }</Text>
                                    </Pressable>
                                ))
                            }

                        </View>
                    </View>
                </ScrollView>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={multipleModalVisible}
                onRequestClose={() => {
                    Alert.alert("多选框关闭");
                    setMultipleModalVisible(!multipleModalVisible);
                }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={true} // 隐藏滚动条（可选）
                >
                    {/* 人员多选modal */}
                    <View style={ modalStyles.modalView }>
                        <View style={ modalStyles.selectView }>
                            {
                                peopleList.map((item: any, index: number) => (
                                    // -TODO 已选的置灰且不可选
                                    <Pressable
                                        style={ ({ pressed }) => [modalStyles.selectItem, styles.samItemEdit, pressed && styles.samItemActive] }
                                        key={ index }
                                        onPress={ _ => multiPeopleSelect(item) }
                                    >
                                        <Text style={ modalStyles.selectItemText }>{ item.name }多选</Text>
                                        {/* <Image source={getIconImage(item.imgIndex)} resizeMode="contain" style={ styles.samItemIcon }></Image> */}
                                    </Pressable>
                                ))
                            }

                        </View>
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
                    <Text style={ styles.topText }>{ route.params.title }</Text>
                        <Pressable
                            style={ ({ pressed }) => [styles.datePA, isEdit && styles.datePAEdit, pressed && styles.datePAActive] }
                            onPress={openDateSelect}
                            disabled={ !isEdit }
                        >
                            <Text style={ styles.dateText }>{ curStartDate.toLocaleDateString().split('/').join('.') }-{ curEndDate && curEndDate.toLocaleDateString().split('/').join('.') }</Text>
                        </Pressable>
                    
                </View>
                <Text
                    style={ [styles.secondText, !isEdit && { height: 30 }] }>
                               { isEdit ? '点击日期进行日期选择，点击职位卡片进行人员选择，选择完毕后按完成按钮退出编辑模式' : '点击右上角编辑按钮进入编辑模式' }
                </Text>
                
                
                <View style={ styles.samList }>
                    {
                        curArrangeDataList.map((item: any, index: number) => (
                            (<Pressable
                                style={ ({ pressed }) => [styles.samItem, isEdit && styles.samItemEdit, { backgroundColor: item.backgroundColor }, pressed && styles.samItemActive] }
                                key={ index }
                                onPress={() => item.isMultiple ? openMultiPeopleSelect(item.name) : openPeopleSelect(item.name)}
                                disabled={ !isEdit }
                            >
                                <Text style={ styles.samItemText }>| { index + 1 } { item.positionName }：      { item.name && item.name.join('、') }</Text>
                                <Image source={getIconImage(item.imgIndex)} resizeMode="contain" style={ styles.samItemIcon }></Image>
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
        margin: 20,
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20
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
    },
    
    selectItem: {
        // flex: 3,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20,
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(216, 213, 206, 1)',
        backgroundColor: 'rgba(255, 255, 255, 1)'
    },
    selectItemText: {
        paddingRight: 50,
        textAlignVertical: 'center',
        height: 80,
        marginHorizontal: 30,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 30,
        textAlign: 'left'
    }
})