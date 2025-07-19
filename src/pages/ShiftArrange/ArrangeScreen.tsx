import { ImageBackground, Image, Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { useCallback, useEffect, useMemo, useState, useLayoutEffect, useRef } from 'react';
import { getNavigation } from '@tools/naviHook'
import { RouteList } from '@tools/route'
import { RouteProp } from '@react-navigation/native';
import { useRealm } from '@realm/react';
import { ArrangeList } from '@tools/zeroExport'
import { compareAsc } from "date-fns";

import { styles } from './css/ArrangeScreenCss'

import { PeopleSelect, PeopleSelectRef } from '@components/ArrangeScreen/PeopleSelect'
import { MultiPeopleSelect, MultiPeopleSelectRef } from '@components/ArrangeScreen/MultiPeopleSelect'
import { DateSelect, DateSelectRef } from '@components/ArrangeScreen/DateSelect'
import { ShareMsg, ShareMsgRef } from '@components/ArrangeScreen/ShareMsg'


const [
    peopleSelectRef,
    multiPeopleSelectRef,
    dateSelectRef,
    shareMsgRef
] = [
    useRef<PeopleSelectRef>(null),
    useRef<MultiPeopleSelectRef>(null),
    useRef<DateSelectRef>(null),
    useRef<ShareMsgRef>(null),
]

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
        'okImage': require('@assets/ok.png'),
        'shareImg': require('@assets/icon-share.png')
    }
    return imgList[index] || require('@assets/m1.png')
}
// 路由参数type，找RouteList中的ArrangeScreen，把它的参数类型赋给route
// -TODO日后整合到一起，就放输出路由的那里
type ASRouteParams = { route: RouteProp<RouteList, 'ArrangeScreen'> }

export function ArrangeScreen({ route }: ASRouteParams) {
    const navigation = getNavigation();
    const [curDataSelect, setCurDataSelect] = useState<{ [key: string]: any }>({}); // 点击职位后获取的当前选择数据
    const [isEdit, setIsEdit] = useState(false); // 是否编辑
    const [curArrangeDataList, setCurArrangeDataList] = useState<Array<{ [key: string]: any }>>([]);
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
        let result = realm.objects('ArrangeList').filtered('positionType == $0', route.params.arrangeType).sorted('startDate', true)
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
            dateSelectRef.current?.setPeriodDateList(Array.from(resMap.values()))
        };
        result.addListener(updateData);

        // 清理监听器
        return () => {
            result.removeListener(updateData);
        };
    }, [realm, route.params.arrangeType]);

    useEffect(() => {
        let tempDataList;
        let startDate: Date | null | undefined = dateSelectRef.current?.getSelectedCurStartDate();
        let endDate: Date | null | undefined = dateSelectRef.current?.getSelectedCurEndDate();
        console.log('进来前先看dataList=====================>', dataList)
        if(dataList.length) {
            // 已经按日期排序过，直接取最大的开始日期的那条数据，获得默认展示数据的开始结束日期
            const lastDate = dataList[0]
            startDate = lastDate!['startDate'] as Date
            endDate = lastDate!['endDate'] as Date
            // 根据默认展示数据的开始结束日期查询对应的数据，并按照职位排序以便于渲染
            tempDataList = dataList.filter(data => compareAsc(new Date(data.startDate), startDate!) === 0).sort((a, b) => a.positionIndex - b.positionIndex)
        } else {
            tempDataList = Array.from(positionList)
        }
        // 逻辑修改，渲染历史数据的日历全走getDataListPeroid，这里只渲染文本，同时setCurSelectedData
        setCurDataSelect(prev => ({ ...prev, startDate, endDate }))
        console.log('看看最后赋值给curAD的tempDataList===================>', tempDataList)
        setCurArrangeDataList(tempDataList)
    }, [dataList])


    // 导航栏加编辑图标
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={ styles.headerRightContainer }>
                    <Pressable 
                        style={ ({ pressed }) => [styles.rbtn, pressed && styles.rbtnActive] }
                        onPress={() => shareMsgOpen() }
                    >
                        <Image source={ getIconImage('shareImg') } style={ [{ resizeMode: 'contain' }, { aspectRatio: 0.8, width: '50%' }] }></Image>
                    </Pressable>
                    <Pressable 
                        style={ ({ pressed }) => [styles.rbtn, pressed && styles.rbtnActive] }
                        onPress={() => setIsEdit(!isEdit)}
                    >
                        <Image source={ isEdit ? getIconImage('okImage') : getIconImage('editImage')} style={ [{ resizeMode: 'contain' }] }></Image>
                    </Pressable>
                </View>
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
    // const { curArrangeDataList } = useMemo(() => {
    //     let tempDataList;
    //     let startDate: Date | null | undefined = dateSelectRef.current?.getSelectedCurStartDate();
    //     let endDate: Date | null | undefined = dateSelectRef.current?.getSelectedCurEndDate();
    //     console.log('进来前先看dataList=====================>', dataList)
    //     if(dataList.length) {
    //         // 已经按日期排序过，直接取最大的开始日期的那条数据，获得默认展示数据的开始结束日期
    //         const lastDate = dataList[0]
    //         startDate = lastDate!['startDate'] as Date
    //         endDate = lastDate!['endDate'] as Date
    //         // 根据默认展示数据的开始结束日期查询对应的数据，并按照职位排序以便于渲染
    //         tempDataList = dataList.filter(data => compareAsc(new Date(data.startDate), startDate!) === 0).sort((a, b) => a.positionIndex - b.positionIndex)
    //     } else {
    //         tempDataList = Array.from(positionList)
    //     }
    //     // 逻辑修改，渲染历史数据的日历全走getDataListPeroid，这里只渲染文本，同时setCurSelectedData
    //     setCurDataSelect(prev => ({ ...prev, startDate, endDate }))
    //     console.log('看看最后赋值给curAD的tempDataList===================>', tempDataList)
    //     return { curArrangeDataList: tempDataList }
    // }, [dataList, positionList, route.params.arrangeType])


    
    console.log('康康人员列表捏===========>peopleList', peopleList)
    console.log('康康职位列表捏===========>positionList', positionList)
    console.log('康康数据列表捏===========>dataList', dataList)
    
    // 分享打开
    const shareMsgOpen = useCallback(() => {
        shareMsgRef.current?.open()
    }, [])

    // 点击数据条目，展开人员选择。新条目时创建新包以供写入使用，旧条目时加增name值和id值，以供展示和更新使用
    const openPeopleSelect = useCallback((item: any) => {
        console.log('看看选了哪条item========>', item)
        if(item.isMultiple){
            // setMultipleModalVisible(true)
            multiPeopleSelectRef.current?.open()
        } else {
            // setModalVisible(true)
            peopleSelectRef.current?.open()
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
        dateSelectRef.current?.setDefaultMemo()
        dateSelectRef.current?.open()
    }

    // 人员选择界面确认按钮
    function selectBtnConfirm() {
        console.log('康康要写入的curData===============>', { ...curDataSelect, startDate: dateSelectRef.current?.getSelectedCurStartDate(), endDate: dateSelectRef.current?.getSelectedCurEndDate()  })
        // 如果没有，等于是除了这条以外给这个日期下的所有职位创建一个空数据，点击剩余的时候走的就不是创建而是修改
        // 如果当前没有选择，且空包（非空包意味着修改），则报错
        const [
            isSelected,
            isNullData
        ] = [
            Boolean(!dateSelectRef.current?.getSelectedCurStartDate() || !dateSelectRef.current?.getSelectedCurEndDate()),
            Boolean(!curDataSelect.startDate || !curDataSelect.endDate)
        ]
        if(isSelected && isNullData){
            Alert.alert('先选日期捏')
            console.log('看看当前curData==================>', curDataSelect);
            return
        }
        try {
            realm.write(() => {
                if(!dataList.length){
                    positionList.forEach((item: any) => {
                        if(item.positionName == curDataSelect.positionName){
                            const data = ArrangeList.generate(
                                curDataSelect.positionId,
                                curDataSelect.positionType,
                                curDataSelect.positionName,
                                curDataSelect.positionIndex,
                                curDataSelect.isMultiple,
                                curDataSelect.imgIndex,
                                curDataSelect.name,
                                curDataSelect.startDate,
                                curDataSelect.endDate
                            )
                            console.log('看看都在写啥=======>', data);
                            realm.create(ArrangeList, data)
                        } else {
                            const data = ArrangeList.generate(
                                item._id,
                                item.positionType,
                                item.positionName,
                                item.positionIndex,
                                item.isMultiple,
                                item.imgIndex,
                                [],
                                curDataSelect.startDate,
                                curDataSelect.endDate
                            )
                            console.log('看看都在写啥=======>', data);
                            realm.create(ArrangeList, data)
                        }
                    })
                } else {
                    console.log('看看你要更新啥===========>', { ...curDataSelect })
                    let updateRes: any = realm.objects('ArrangeList').filtered('_id == $0', curDataSelect._id)[0]
                    updateRes.name = curDataSelect.name
                }
            });
        } catch (error) {
            console.log('出错了捏============>', error)
        }
        peopleSelectRef.current?.close()
        multiPeopleSelectRef.current?.close()
    }
    function queryDateData(date: Date) {
        // 直接realm中查start小于等于传进来的日期，end大于等于传进来日期的数据
        let result = realm.objects('ArrangeList').filtered('positionType == $0 AND startDate <= $1 AND endDate >= $2', route.params.arrangeType, date, date).sorted('startDate', true)
        console.log('康康查询的result============>', [...result])
        setDataList(Array.from(result))
    }

    return (
        <ImageBackground source={ getIconImage('backgroundImage') } resizeMode='cover' style={ styles.ibg }>
            {/* 单选组件 */}
            <PeopleSelect
                peopleList={ peopleList }
                curDataSelect={ curDataSelect }
                setCurDataSelect={ setCurDataSelect }
                selectBtnConfirm={ selectBtnConfirm }
                ref={ peopleSelectRef }
            ></PeopleSelect>
            {/* 多选组件 */}
            <MultiPeopleSelect
                peopleList={ peopleList }
                curDataSelect={ curDataSelect }
                setCurDataSelect={ setCurDataSelect }
                selectBtnConfirm={ selectBtnConfirm }
                ref={ multiPeopleSelectRef }
            ></MultiPeopleSelect>
            {/* 日期组件 */}
            <DateSelect dataList={ dataList } queryDateData={ queryDateData } ref={ dateSelectRef }></DateSelect>
            {/* 分享组件 */}
            <ShareMsg dataList={curArrangeDataList} ref={ shareMsgRef }></ShareMsg>

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
