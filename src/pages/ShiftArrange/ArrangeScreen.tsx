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
import { ArrangeList } from '@tools/zeroExport'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { eachDayOfInterval, format, compareDesc } from "date-fns";


// -TODO cn对象整合到工具里，方便整体修改
LocaleConfig.locales['cn'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesShort: ['七', '一', '二', '三', '四', '五', '六'],
    today: "今天"
}

LocaleConfig.defaultLocale = 'cn';

// -TODO 日后整合到工具里，这样一改全改方便
const realm = useRealm()

// -TODO 日后整合到工具里，省的每个页面都写
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
// 路由参数type，找RouteList中的ArrangeScreen，把它的参数类型赋给route
// -TODO日后整合到一起，就放输出路由的那里
type ASRouteParams = { route: RouteProp<RouteList, 'ArrangeScreen'> }

export function ArrangeScreen({ route }: ASRouteParams) {
    const navigation = getNavigation();
    const [modalVisible, setModalVisible] = useState(false); // 单选modal显隐
    const [multipleModalVisible, setMultipleModalVisible] = useState(false); // 多选modal显隐
    const [dateModalVisible, setDateModalVisible] = useState(false); // 日期modal显隐
    const [curDataSelect, setCurDataSelect] = useState<{ [key: string]: any }>({}); // 点击职位后获取的当前选择数据
    const [selectedStartDate, setSelectedCurStartDate] = useState<Date | null>(null) // 编辑时选的当前开始日期
    const [selectedEndDate, setSelectedCurEndDate] = useState<Date | null>(null); // 编辑时选的当前结束日期
    const [periodDateList, setPeriodDateList] = useState<Array<{ [key: string]: Date }> | null>(null); // 日期逻辑预存数组
    const [selectedDateMemo, setSelectedDateMemo] = useState<{ [key: string]: Date | null }>({ 'memoStart': null, 'memoEnd': null }); // 当前选择缓存
    const [isEdit, setIsEdit] = useState(false); // 是否编辑
    // 当前arrangeType的data全查并放进dataList
    const [dataList, setDataList] = useState<Array<{ [key: string]: any }>>([])
    console.log('看看刷新后的data---------------->', curDataSelect)
    // 给职位列表和人员列表查询做缓存，避免重复调取资源
    const { peopleList, positionList } = useMemo(() => ({
        positionList : realm.objects('ArrangePosition').filtered('positionType == $0', route.params.arrangeType),
        peopleList : realm.objects('ArrangePeople')
    }), [realm, route.params.arrangeType])
    // 查全数据做缓存，并设置监听器，查全数据意味着数据发生变更，因此也需要重新设置一下日期集
    useEffect(() => {
        // 初始查询
        let result = realm.objects('ArrangeList').filtered('positionType == $0', route.params.arrangeType)
        // 添加监听器
        const updateData = () => {
            setDataList(Array.from(result))
            // 根据startDate去重，并获取所有对应的endDate
            const resMap = new Map()
            for (const item of result) {
                const dateKey = (item['startDate'] as Date).toISOString()
                if(!resMap.has(dateKey)){
                    resMap.set(dateKey, { startDate: item['startDate'], endDate: item['endDate'] })
                }
            }
            setPeriodDateList(Array.from(resMap.values()))
        };
        result.addListener(updateData);
        // 清理监听器
        return () => {
            result.removeListener(updateData);
        };
    }, [realm, route.params.arrangeType]);
    console.log('看看刷新后的periodDateList---------------->', periodDateList)
    // 导航栏加编辑图标
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable 
                    style={ ({ pressed }) => [styles.rbtn, pressed && styles.rbtnActive] }
                    onPress={() => setIsEdit(!isEdit)}
                >
                    <Image source={ isEdit ? getIconImage('okImage') : getIconImage('editImage')} style={ [{ resizeMode: 'contain' }] }></Image>
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
    const { curArrangeDataList, defaultStartDate, defaultEndDate } = useMemo(() => {
        let tempDataList;
        let startDate: Date | null = null;
        let endDate: Date | null = null;
        console.log('进来前先看dataList=====================>', dataList)
        if(dataList.length){
            startDate = new Date()
            console.log('先查最近开始日期，看看查询条件=============>', route.params.arrangeType, startDate)
            // tempDataList = dataList.filtered('positionType == $0 AND startDate < $1', route.params.arrangeType, startDate).sorted('startDate', true)
            tempDataList = dataList.filter(data => data.positionType == route.params.arrangeType && compareDesc(new Date(data.startDate), startDate!) > 0).sort((a, b) => compareDesc(new Date(a.startDate), new Date(b.startDate)))
            console.log('看看查询结果=============>', tempDataList)
            if(!tempDataList.length){
                tempDataList = dataList.filter(data => data.positionType == route.params.arrangeType && compareDesc(new Date(data.startDate), startDate!) < 0).sort((a, b) => compareDesc(new Date(a.startDate), new Date(b.startDate)))
            }
            const lastDate = tempDataList[0]
            startDate = lastDate!['startDate'] as Date
            endDate = lastDate!['endDate'] as Date
            // tempDataList = dataList.filtered('positionType == $0 AND startDate == $1', route.params.arrangeType, startDate).sorted('positionIndex')
            tempDataList = dataList.filter(data => data.positionType == route.params.arrangeType && compareDesc(new Date(data.startDate), startDate!) === 0).sort((a, b) => a.positionIndex - b.positionIndex)
            // tempDataList = Array.from(tempDataList)
        } else {
            console.log('看看试试==============>', Array.from(positionList))
            // setCurArrangeDataList(Array.from(positionList))
            tempDataList = Array.from(positionList)
        }
        // 逻辑修改，渲染历史数据的日历全走getDataListPeroid，这里只渲染文本，同时setCurSelectedData
        // setSelectedCurStartDate(startDate)
        // setSelectedCurEndDate(endDate)
        setCurDataSelect(prev => ({ ...prev, startDate, endDate }))
        console.log('看看最后赋值给curAD的tempDataList===================>', tempDataList)
        return { curArrangeDataList: tempDataList, defaultStartDate: startDate, defaultEndDate: endDate }
    }, [dataList, positionList, route.params.arrangeType])



    // 日期onpress
    const daySelect = useCallback((date: any) => {
        console.log('看看选择的日期=============>', date)
        // 日期选中效果，只有第二次选中日期在第一次之后才给设置，否则全重新设置开始
        // 已经选中开始日期的时候再点日期则取消选中
        if(selectedStartDate && !selectedEndDate && compareDesc(selectedStartDate, new Date(date.dateString)) > 0){
            setSelectedCurEndDate(new Date(date.dateString))
        } else if(selectedStartDate && compareDesc(selectedStartDate, new Date(date.dateString)) === 0){
            setSelectedCurStartDate(null)
            setSelectedCurEndDate(null)
        } else {
            setSelectedCurStartDate(new Date(date.dateString))
            setSelectedCurEndDate(null)
        }
        // getPeroidDate()
    }, [selectedStartDate, selectedEndDate]) 


    // 拆分逻辑，selected日期只负责日历渲染，不负责日期文本渲染和selectedData填充
    const getSelectedPeroidDate = useCallback(() => {
        let peroidDateObj: { [key: string]: any } = {}
        if(selectedStartDate && selectedEndDate){
            const dates = eachDayOfInterval({ start: selectedStartDate!, end: selectedEndDate! })
            dates.forEach((item, index) => {
                switch (index) {
                    case 0:
                        peroidDateObj[format(item, 'yyyy-MM-dd')] = { startingDay: true, color: 'rgba(250, 240, 216, 1)' }
                        break;
                    case dates.length -1:
                        peroidDateObj[format(item, 'yyyy-MM-dd')] = { endingDay: true, color: 'rgba(250, 240, 216, 1)' }
                        break;
                    default:
                        peroidDateObj[format(item, 'yyyy-MM-dd')] = { color: 'rgba(250, 240, 216, 1)' }
                        break;
                }
            })
        } else if (!selectedStartDate && selectedEndDate){
            peroidDateObj[format(selectedEndDate, 'yyyy-MM-dd')] = { color: 'rgba(250, 240, 216, 1)' }
        } else if (selectedStartDate && !selectedEndDate){
            peroidDateObj[format(selectedStartDate, 'yyyy-MM-dd')] = { color: 'rgba(250, 240, 216, 1)' }
        }
        console.log('看看涂上颜色的是哪些日期--------->', peroidDateObj)
        return peroidDateObj
    }, [selectedStartDate, selectedEndDate])
    
    const getDataListPeroidDate = useCallback(() => {
        let peroidDateObj: { [key: string]: any } = {}
        // if(selectedStartDate && selectedEndDate){
        //     const dates = eachDayOfInterval({ start: selectedStartDate!, end: selectedEndDate! })
        //     dates.forEach((item, index) => {
        //         switch (index) {
        //             case 0:
        //                 peroidDateObj[format(item, 'yyyy-MM-dd')] = { startingDay: true, color: 'rgba(250, 240, 216, 1)' }
        //                 break;
        //             case dates.length -1:
        //                 peroidDateObj[format(item, 'yyyy-MM-dd')] = { endingDay: true, color: 'rgba(250, 240, 216, 1)' }
        //                 break;
        //             default:
        //                 peroidDateObj[format(item, 'yyyy-MM-dd')] = { color: 'rgba(250, 240, 216, 1)' }
        //                 break;
        //         }
        //     })
        // } else if (!selectedStartDate && selectedEndDate){
        //     peroidDateObj[format(selectedEndDate, 'yyyy-MM-dd')] = { color: 'rgba(250, 240, 216, 1)' }
        // } else if (selectedStartDate && !selectedEndDate){
        //     peroidDateObj[format(selectedStartDate, 'yyyy-MM-dd')] = { color: 'rgba(250, 240, 216, 1)' }
        // }
        console.log('看看涂上颜色的是哪些日期--------->', peroidDateObj)
        return peroidDateObj
    }, [dataList])

    
    // 取所有数据库中的开始日期去重，留下的数据查对应的结束日期，做peroid且disabled
    const getPeroidDate = useCallback(() => {
        // debugger
        // 点击时触发的渲染
        let spd = getSelectedPeroidDate()
        // 初始化时触发的渲染
        let dpd = getDataListPeroidDate()
        return {...spd, ...dpd}
    }, [getSelectedPeroidDate, getDataListPeroidDate])


    // let [curStartDate, curEndDate] = selectedStartDate ? [selectedStartDate, selectedEndDate] : [defaultStartDate, defaultEndDate]

    console.log('康康人员列表捏===========>peopleList', peopleList)
    console.log('康康职位列表捏===========>positionList', positionList)
    console.log('康康数据列表捏===========>dataList', dataList)


    // 点击数据条目，展开人员选择。新条目时创建新包以供写入使用，旧条目时加增name值和id值，以供展示和更新使用
    const openPeopleSelect = useCallback((item: any) => {
        console.log('看看选了哪条item========>', item)
        if(item.isMultiple){
            setMultipleModalVisible(true)
        } else {
            setModalVisible(true)
        }
        if(item.name){
            // positionId: BSON.ObjectId, positionType: number, positionName: string, positionIndex: number, isMultiple: boolean, name: Array<string>, startDate: Date, endDate: Date
            // 更新数据包，只负责展示，算了干脆全加上反正不占多少算力
            setCurDataSelect({
                _id: item._id,
                positionId: item.positionId,
                positionType: item.positionType, // 不需要type
                positionName: item.positionName,
                positionIndex: item.positionIndex, // 不需要排序
                isMultiple: item.isMultiple,
                imgIndex: item.imgIndex,
                name: item.name,
                startDate: item.startDate,
                endDate: item.endDate
            })
        } else {
            // 新条目，没有_id，之后哪怕是空的也有_id
            setCurDataSelect(prev => ({
                ...prev, // 包含日期
                // _id: item._id,
                positionId: item._id,
                positionType: item.positionType,
                positionName: item.positionName,
                positionIndex: item.positionIndex,
                isMultiple: item.isMultiple,
                imgIndex: item.imgIndex,
                name: [],
            }))
        }
    }, [])

    // 日期文本onpress 打开的时候设置 先用memo设置过一遍
    function openDateSelect() {
        setSelectedCurStartDate(selectedDateMemo.memoStart)
        setSelectedCurEndDate(selectedDateMemo.memoEnd)
        setDateModalVisible(true)
    }

    // -二期TODO 增加已选中角色的List获取
    const getPeopleDisabled = useCallback((item: any) => {
        return (curDataSelect.name && curDataSelect.name.length && curDataSelect.name.findIndex((sp: string) => sp == item.name) != -1) ? true : false
    }, [dataList, curDataSelect.name])

    const getMultiDisable = useCallback((item: any) => {
        return (curDataSelect.name && curDataSelect.name.length && curDataSelect.name.findIndex((sp: string) => sp == item.name) != -1) ? true : false
    }, [dataList, curDataSelect.name])

    // 人员选择modal人员条目onpress
    // 因为每一次都是替换，所以不用管前一次是啥，这个可以写成缓存
    const peopleSelect = useCallback((item: any) => {
        console.log('看看选择的人---------------->', item)
        setCurDataSelect(prev => ({ ...prev, name: [item.name] }))
    }, [])
    
    // 多选人员选择界面的人员条目onpress
    // 每一次动会根据上一次的逻辑，所以需要以来curDataSelect
    const multiPeopleSelect = useCallback((item: any) => {
        console.log('看看选择的人---------------->', item)
        setCurDataSelect(prev => {
            // 如果之前选择的人里面不包含当前选择，则name中追加当前选择的name，如果有，则剔除，做到重复点击取消，同时记得把disable给取消掉
            let nameIndex = prev.name.findIndex((name: string) => name == item.name)
            if(nameIndex == -1){
                return ({ ...prev, name: prev.name.concat(item.name) })
            } else {
                let tempArr = JSON.parse(JSON.stringify(prev.name))
                tempArr.splice(nameIndex, 1)
                return ({ ...prev, name: tempArr })
            }
        })
    }, [curDataSelect])
    
    const isLastChoice = useCallback((item: any) => {
        if(dataList.length){

        }
        return true
    }, [dataList])

    // 人员选择界面确认按钮
    function selectBtnConfirm() {
        console.log('康康要写入的curData===============>', { ...curDataSelect, startDate: selectedStartDate, endDate: selectedEndDate  })
        // 如果没有，等于是除了这条以外给这个日期下的所有职位创建一个空数据，点击剩余的时候走的就不是创建而是修改
        if(!selectedStartDate || !selectedEndDate){
            Alert.alert('先选日期捏')
            return
        }
        try {
            realm.write(() => {
                if(!dataList.length){
                    positionList.forEach((item: any) => {
                        if(item.positionName == curDataSelect.positionName){
                            console.log('看看都在写啥=======>', ArrangeList.generate(
                                curDataSelect.positionId,
                                curDataSelect.positionType,
                                curDataSelect.positionName,
                                curDataSelect.positionIndex,
                                curDataSelect.isMultiple,
                                curDataSelect.imgIndex,
                                curDataSelect.name,
                                curDataSelect.startDate,
                                curDataSelect.endDate
                                // selectedStartDate!,
                                // selectedEndDate!
                            ));
                            realm.create(ArrangeList, ArrangeList.generate(
                                curDataSelect.positionId,
                                curDataSelect.positionType,
                                curDataSelect.positionName,
                                curDataSelect.positionIndex,
                                curDataSelect.isMultiple,
                                curDataSelect.imgIndex,
                                curDataSelect.name,
                                curDataSelect.startDate,
                                curDataSelect.endDate
                                // selectedStartDate!,
                                // selectedEndDate!
                            ))
                        } else {
                            console.log('看看都在写啥=======>', ArrangeList.generate(
                                item._id,
                                item.positionType,
                                item.positionName,
                                item.positionIndex,
                                item.isMultiple,
                                item.imgIndex,
                                [],
                                curDataSelect.startDate,
                                curDataSelect.endDate
                                // selectedStartDate!,
                                // selectedEndDate!
                            ));
                            realm.create(ArrangeList, ArrangeList.generate(
                                item._id,
                                item.positionType,
                                item.positionName,
                                item.positionIndex,
                                item.isMultiple,
                                item.imgIndex,
                                [],
                                curDataSelect.startDate,
                                curDataSelect.endDate
                                // selectedStartDate!,
                                // selectedEndDate!
                            ))
                        }
                    })
                } else {
                    console.log('看看你要更新啥===========>', { ...curDataSelect })
                    let updateRes: any = realm.objects('ArrangeList').filtered('_id == $0', curDataSelect._id)[0]
                    // const {_id, ...tempData} = curDataSelect
                    updateRes.name = curDataSelect.name
                }
            });
        } catch (error) {
            console.log('出错了捏============>', error)
        }
        setModalVisible(false)
        setMultipleModalVisible(false)
    }
    
    // 人员选择modal取消按钮
    const selectBtnCancel = useCallback(() => {
        // curdataselect不控制显示，只是预存当前数据，所以无论是否进来时有数据都统一清空名字，只有确定时才写入
        setCurDataSelect(prev => ({ ...prev, name: [] }))
        setModalVisible(false)
        setMultipleModalVisible(false)
    }, [])

    // 点击时已经setCurSelected了，确定逻辑是往curSelectedData里塞从而渲染文本，同时存一下缓存以便取消用
    function dateBtnConfirm() {
        console.log('康康要设定的{ curStartDate, curEndDate }===================>', { selectedStartDate, selectedEndDate })
        setSelectedDateMemo(prev => ({...prev, memoStart: selectedStartDate, memoEnd: selectedEndDate}))
        setCurDataSelect(prev => ({ ...prev, startDate: selectedStartDate, endDate: selectedEndDate }))
        setDateModalVisible(false)
    }
    
    // 日期modal取消按钮 取消当前的selected至null，文本因为没过确定不变，再打开时还按curSelectedData中取start和end来渲染
    const dateBtnCancel = useCallback(() => {
        // setSelectedCurStartDate(defaultStartDate)
        // setSelectedCurEndDate(defaultEndDate)
        setSelectedCurEndDate(null)
        setSelectedCurStartDate(null)
        // setCurDataSelect(prev => ({ ...prev, startDate: defaultStartDate, endDate: defaultEndDate }))
        setDateModalVisible(false)
    }, [defaultStartDate, defaultEndDate])

    const isSubArr = useCallback((arrA: Array<number | string>, arrB: Array<number | string>) => {
        let setB = new Set(arrB)
        arrA.every(item => setB.has(item))
        
    }, [])

    return (
        <ImageBackground source={ getIconImage('backgroundImage') } resizeMode='cover' style={ styles.ibg }>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={ selectBtnCancel }
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
                                        style={
                                            ({ pressed }) => [
                                                modalStyles.selectItem, 
                                                styles.samItemEdit, 
                                                pressed && styles.samItemActive, 
                                                getPeopleDisabled(item) ? { backgroundColor: 'rgb(136, 136, 136)' } : {},
                                                isLastChoice(item) ? { borderColor: 'rgba(250, 240, 216, 1)' } : {}
                                            ]
                                        }
                                        key={ index }
                                        onPress={ _ => peopleSelect(item) }
                                        disabled={ getPeopleDisabled(item) }
                                    >
                                        <Text style={ modalStyles.selectItemText }>{ item.name }</Text>
                                    </Pressable>
                                ))
                            }
                            
                            <View style={ modalStyles.bottomView }>
                                <Pressable 
                                    style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgYellow, pressed && styles.samItemActive] }
                                    onPress={ selectBtnConfirm }
                                >
                                    <Text style={ modalStyles.btnText }>确认</Text>
                                </Pressable>
                                <Pressable 
                                    style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgWhite, pressed && styles.samItemActive ] }
                                    onPress={ selectBtnCancel }
                                >
                                    <Text style={ modalStyles.btnText }>关闭</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={multipleModalVisible}
                onRequestClose={() => {
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
                                    <Pressable
                                        style={
                                            ({ pressed }) => [
                                                modalStyles.selectItem, 
                                                styles.samItemEdit, 
                                                pressed && styles.samItemActive, 
                                                getMultiDisable(item) ? { backgroundColor: 'rgb(136, 136, 136)' } : {},
                                                isLastChoice(item) ? { borderColor: 'rgba(250, 240, 216, 1)' } : {}
                                            ] 
                                        }
                                        key={ index }
                                        onPress={ _ => multiPeopleSelect(item) }
                                        // disabled={ getMultiDisable(item) }
                                    >
                                        <Text style={ modalStyles.selectItemText }>{ item.name }</Text>
                                        {/* <Image source={getIconImage(item.imgIndex)} resizeMode="contain" style={ styles.samItemIcon }></Image> */}
                                    </Pressable>
                                ))
                            }

                        </View>
                        <View style={ modalStyles.bottomView }>
                            <Pressable 
                                style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgYellow, pressed && styles.samItemActive] }
                                onPress={ selectBtnConfirm }
                            >
                                <Text style={ modalStyles.btnText }>确认</Text>
                            </Pressable>
                            <Pressable 
                                style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgWhite, pressed && styles.samItemActive ] }
                                onPress={ selectBtnCancel }
                            >
                                <Text style={ modalStyles.btnText }>关闭</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={dateModalVisible}
                onRequestClose={() => {
                    Alert.alert("日历modal关闭");
                    setDateModalVisible(!dateModalVisible);
                }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={true} // 隐藏滚动条（可选）
                        // 所需逻辑：
                        // 一开始进来默认设置最近的数据，编辑时日期表上五颜六色的历史记录，点击已存的记录直接默认是查询并关闭弹窗关闭编辑模式展示该记录的数据，(并且设置该记录为对比记录?)\
                        // 点击未存 在日期点击方法中判断当前点击是否在历史peroid之内，如果在，不追加peroid样式，按查询处理，如果不在且start当前为Null，设置，如果不在且start有值且end为null，已经过了是否在peroid逻辑，只需要判断start是否小于最小，当前点击是否大于最大，是报错清除selected，否则走新建
                        // 日期modal确认按钮 如果开始日期结束日期之间有数据，那么不行，如果开始日期和结束
                >
                    <View style={ modalStyles.dateModalView }>
                        <View style={ modalStyles.dateSelectView }>
                            <Calendar
                                markingType={'period'}
                                markedDates={ getPeroidDate() }
                                onDayPress={ daySelect }
                            ></Calendar>
                        </View>
                        <View style={ modalStyles.bottomView }>
                            <Pressable 
                                style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgYellow, pressed && styles.samItemActive] }
                                onPress={ dateBtnConfirm }
                            >
                                {/* -二期TODO 开始日期在peroid内的不许set日期，包含peroid的不许set日期（弹提示报错），点了peroid内之后弹提示已经设置查询日期，点击查询捏，点在peroid以外的改为写入 */}
                                <Text style={ modalStyles.btnText }>确定</Text>
                            </Pressable>
                            <Pressable 
                                style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgWhite, pressed && styles.samItemActive ] }
                                onPress={ dateBtnCancel }
                            >
                                <Text style={ modalStyles.btnText }>关闭</Text>
                            </Pressable>
                        </View>
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
                            <Text style={ styles.dateText }>{ curDataSelect.startDate && curDataSelect.startDate.toLocaleDateString().split('/').join('.') }-{ curDataSelect.endDate && curDataSelect.endDate.toLocaleDateString().split('/').join('.') }</Text>
                        </Pressable>
                    
                </View>
                <Text
                    style={ [styles.secondText, !isEdit && { height: 30 }] }>
                    { isEdit ? '点击日期进行日期选择，点击职位卡片进行人员选择，选择完毕后按完成按钮退出编辑模式' : '点击右上角编辑按钮进入编辑模式，点击日期选择日期范围进行查询' }
                </Text>
                
                
                <View style={ styles.samList }>
                    {
                        curArrangeDataList.map((item: any, index: number) => (
                            (<Pressable
                                style={ ({ pressed }) => [styles.samItem, isEdit && styles.samItemEdit, { backgroundColor: item.backgroundColor }, pressed && styles.samItemActive] }
                                key={ index }
                                // onPress={() => item.isMultiple ? openMultiPeopleSelect(item) : openPeopleSelect(item)}
                                onPress={() => openPeopleSelect(item)}
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
        flex: 1,
        // aspectRatio: 1,
        // width: '20%',
        marginTop: 15,
        marginBottom: 15,
        // marginRight: 20
        
    },
    samItemText: {
        flex: 7,
        paddingRight: 50,
        textAlignVertical: 'center',
        height: 80,
        overflow: 'scroll',
        marginHorizontal: 30,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 30,
        textAlign: 'left'
    },
    editImg: {
        // width: '100%',
        resizeMode: 'contain',
        
    },
    okImg: {
    },
    rbtn: {
        padding: 0,
        height: 'auto',
        // position: 'relative',
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
    bgWhite: {
        backgroundColor: 'rgba(255, 255, 255, 1)'
    },
    bgYellow: {
        backgroundColor: 'rgba(250, 240, 216, 1)'
    },
    bgGrey: {
        backgroundColor: 'rgba(216, 213, 206, 1)'      
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    dateSelectView: {
        // flex: 1,
        margin: 40,
        width: '90%',
        backgroundColor: 'rgba(0, 0, 0, 1)'
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
    },
    bottomView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    bottomBtn: {
        flex: 1,
        margin: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(158, 155, 149, 1)'
    },
    btnText: {
        // paddingRight: 50,
        textAlignVertical: 'center',
        height: 80,
        // marginHorizontal: 30,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 30,
        textAlign: 'center'
    }
})