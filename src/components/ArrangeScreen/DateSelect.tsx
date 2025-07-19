import { Text, View, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { styles, modalStyles } from '@pages/ShiftArrange/css/ArrangeScreenCss'

import { Calendar, LocaleConfig } from 'react-native-calendars';
import { eachDayOfInterval, format, compareAsc } from "date-fns";

enum ClickState {
    QueryData, // 情况1，查询数据
    CreateStart, // 情况2， 新建开始日期
    CreateEnd, // 情况3， 新建结束日期
    CancelSelect // 情况4， 取消选择
}

// -TODO cn对象整合到工具里，方便整体修改
LocaleConfig.locales['cn'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesShort: ['七', '一', '二', '三', '四', '五', '六'],
    today: "今天"
}

LocaleConfig.defaultLocale = 'cn';

export type DateSelectRef = {
    open: () => void;
    close: () => void;
    setPeriodDateList: (list: Array<{ [key: string]: Date }> | null) => void;
    setDefaultMemo: () => void;
    getSelectedCurStartDate: () => Date | null;
    getSelectedCurEndDate: () => Date | null;
}
export const DateSelect = forwardRef(({
    dataList,
    queryDateData
}: any, ref) => {
    const [dateModalVisible, setDateModalVisible] = useState(false); // 日期modal显隐
    const [periodDateList, setPeriodDateList] = useState<Array<{ [key: string]: Date }> | null>(null); // 日期逻辑预存数组
    const [selectedStartDate, setSelectedCurStartDate] = useState<Date | null>(null) // 编辑时选的当前开始日期
    const [selectedEndDate, setSelectedCurEndDate] = useState<Date | null>(null); // 编辑时选的当前结束日期
    const [selectedDateMemo, setSelectedDateMemo] = useState<{ [key: string]: Date | null }>({ 'memoStart': null, 'memoEnd': null }); // 当前选择缓存
    useImperativeHandle(ref, () => ({
        open: () => {
            console.log('进里面来了捏================>', ref)
            setDateModalVisible(true)
        },
        close: () => setDateModalVisible(false),
        setPeriodDateList: (list: Array<{ [key: string]: Date }> | null) => setPeriodDateList(list),
        setDefaultMemo: () => {
            setSelectedCurStartDate(selectedDateMemo.memoStart)
            setSelectedCurEndDate(selectedDateMemo.memoEnd)
        },
        getSelectedCurStartDate: () => selectedStartDate,
        getSelectedCurEndDate: () => selectedEndDate
    }))

    
        // 历史数据渲染
    const getDataListPeroidDate = useCallback(() => {
        let peroidDateObj: { [key: string]: any } = {}
        periodDateList?.forEach(item => {
            peroidDateObj = { ...peroidDateObj, ...reformDateList(item.startDate, item.endDate, 0)}
        })
        console.log('初始化渲染，看看涂上颜色的是哪些日期--------->', peroidDateObj)
        return peroidDateObj
    }, [dataList])

    // 拆分逻辑，selected日期只负责日历渲染，不负责日期文本渲染和selectedData填充
    // 点击时触发的渲染
    const getSelectedPeroidDate = useCallback(() => {
        let peroidDateObj: { [key: string]: any } = {}
        if(selectedStartDate && selectedEndDate){
            peroidDateObj = reformDateList(selectedStartDate, selectedEndDate, 1)
        } else if (!selectedStartDate && selectedEndDate){
            peroidDateObj[format(selectedEndDate, 'yyyy-MM-dd')] = { color: 'rgba(250, 240, 216, 1)' }
        } else if (selectedStartDate && !selectedEndDate){
            peroidDateObj[format(selectedStartDate, 'yyyy-MM-dd')] = { color: 'rgba(250, 240, 216, 1)' }
        }
        console.log('看看涂上颜色的是哪些日期--------->', peroidDateObj)
        return peroidDateObj
    }, [selectedStartDate, selectedEndDate])

    // 取所有数据库中的开始日期去重，留下的数据查对应的结束日期，做peroid且disabled
    const getPeroidDate = useCallback(() => {
        // debugger
        // 点击时触发的渲染
        let spd = getSelectedPeroidDate()
        // 初始化时触发的渲染
        let dpd = getDataListPeroidDate()
        return {...spd, ...dpd}
    }, [getSelectedPeroidDate, getDataListPeroidDate])

    // 分装点击情况
    const getClickState = useCallback((clickedDate: Date, periodDateList: Array<{ [key: string]: Date }> | null, paramSelectedStartDate: Date | null, paramSelectedEndDate: Date | null) => {
        // 情况1：点击的是已有period中的某天，是为了查询
            // 对periodDateList进行遍历，如果在某一段之间，即clickedDate大于遍历中当前item的开始日期且小于当前item的结束日期，则认为是情况1
        if(periodDateList && periodDateList.length){
            let checkFlag = periodDateList.some(item => compareAsc(item.startDate, clickedDate) <= 0 && compareAsc(item.endDate, clickedDate) >= 0)
            if(checkFlag){
                return ClickState.QueryData
            }
        }

        // 情况2：为了新建开始，点击的只能是非周期内
            // 如果不是情况1，那就说明点在了非周期内，那就确认是否存在selectedStartDate，如果没有，或者已经选完开始结束（则认为是新一轮的开始），或者有了开始但是当前点的结束是在已经有了的开始之前，则认为是情况2
        const [
            isNoStart, // 没有开始
            isSelectionComplete, // 新一轮的开始
            isEndBeforeStart // 选在了开始之前
        ] = [
            !paramSelectedStartDate, 
            Boolean(paramSelectedStartDate && paramSelectedEndDate), 
            Boolean(paramSelectedStartDate && !paramSelectedEndDate && compareAsc(paramSelectedStartDate, clickedDate) > 0)
        ]

        if(isNoStart || isSelectionComplete || isEndBeforeStart){
            return ClickState.CreateStart
        }

        // 情况3：为了新建结束，点击的只能是非周期内    
            // 如果不是情况1和2，说明当前点在了非周期内，且存在selectedStartDate，那就判断当前点击的是不是等于selectedStartDate，如果不是，则是情况3
        if(paramSelectedStartDate && !paramSelectedEndDate && compareAsc(paramSelectedStartDate, clickedDate) != 0){
            return ClickState.CreateEnd
        }
        
        // 情况4：为了点击自己取消选择
            // 如果不是情况1、2和3，则说明点在了非周期内且已存在selectedStartDate且当前点击等于selectedStartDate，则只能是情况4
        return ClickState.CancelSelect

    }, [])

    // 日期被点击时
    const daySelect = useCallback((date: any) => {
        const clickedDate = new Date(date.dateString)
        const state = getClickState(clickedDate, periodDateList, selectedStartDate, selectedEndDate)
        switch (state) {
            case ClickState.QueryData:
                queryDateData(clickedDate)
                setDateModalVisible(false)
                break;
            case ClickState.CreateStart:
                setSelectedCurStartDate(clickedDate)
                setSelectedCurEndDate(null)
                break;
            case ClickState.CreateEnd:
                // 创建结束的时候要判断当前开始和结束是否覆盖了已有周期
                if(periodDateList && periodDateList.length){
                    // 只要存在当前选择的开始日期在结束日期之前，且点击的日期在结束日期之后，即覆盖了任意一个周期时，都认为有覆盖，抛出
                    const checkFlag = [...periodDateList].some(item => compareAsc(selectedStartDate!, item.startDate) <= 0 && compareAsc(clickedDate, item.endDate) >= 0)
                    if(checkFlag){
                        Alert.alert('不能覆盖其他日期记录捏')
                        setSelectedCurStartDate(null)
                        setSelectedCurEndDate(null)
                        break;
                    }
                }
                setSelectedCurEndDate(clickedDate)
                break;
            case ClickState.CancelSelect:
                setSelectedCurStartDate(null)
                setSelectedCurEndDate(null)
                break;
        }

    }, [selectedStartDate, selectedEndDate, periodDateList])

    // 周期渲染，历史数据type=0颜色为'rgba(148, 136, 109, 1)'，选择数据type=1颜色为'rgba(250, 240, 216, 1)'
    const reformDateList = useCallback((startDate: Date, endDate: Date, type: number) => {
        let peroidDateObj: { [key: string]: any } = {}
        const dates = eachDayOfInterval({ start: startDate, end: endDate })
        dates.forEach((item, index) => {
            switch (index) {
                case 0:
                    peroidDateObj[format(item, 'yyyy-MM-dd')] = { startingDay: true, color: type == 0 ? 'rgba(148, 136, 109, 1)' : 'rgba(250, 240, 216, 1)'}
                    break;
                case dates.length -1:
                    peroidDateObj[format(item, 'yyyy-MM-dd')] = { endingDay: true, color: type == 0 ? 'rgba(148, 136, 109, 1)' : 'rgba(250, 240, 216, 1)' }
                    break;
                default:
                    peroidDateObj[format(item, 'yyyy-MM-dd')] = { color: type == 0 ? 'rgba(148, 136, 109, 1)' : 'rgba(250, 240, 216, 1)' }
                    break;
            }
        })
        return peroidDateObj
    }, [])

        // 点击时已经setCurSelected了，确定逻辑是往curSelectedData里塞从而渲染文本，同时存一下缓存以便取消用
    // 如果是查询，则不会走到确定，点击查询的一瞬间就关闭了，点击确定只能是新建，所以要走查询逻辑，查询查不到自动清空
    function dateBtnConfirm() {
        console.log('康康要设定的{ curStartDate, curEndDate }===================>', { selectedStartDate, selectedEndDate })
        const [
            isCreate,
            isClose,
            isError
        ] = [
           Boolean(selectedStartDate && selectedEndDate),
           Boolean(!selectedStartDate && !selectedEndDate),
           Boolean(selectedStartDate && !selectedEndDate)
        ]
        if(isCreate){
            setSelectedDateMemo({memoStart: selectedStartDate, memoEnd: selectedEndDate})
            // setCurDataSelect(prev => ({ ...prev, startDate: selectedStartDate, endDate: selectedEndDate }))
            
            // console.log('康康要写入的curData===============>', { ...curDataSelect, startDate: selectedStartDate, endDate: selectedEndDate  })
            queryDateData(selectedStartDate!)
            setDateModalVisible(false)
            return
        }

        if(isClose){
            dateBtnCancel()
            return
        }

        if(isError){
            Alert.alert('要选结束日期再确定捏')
            return
        }
    }
    
    // 日期modal取消按钮 取消当前的selected至null，文本因为没过确定不变，再打开时还按curSelectedData中取start和end来渲染
    const dateBtnCancel = useCallback(() => {
        setSelectedCurEndDate(null)
        setSelectedCurStartDate(null)
        setDateModalVisible(false)
    }, [])

    return (
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
                    // 一开始进来默认设置最近的数据，编辑时日期表上五颜六色的历史记录，点击已存的记录直接默认是查询并关闭弹窗关闭编辑模式展示该记录的数据，(并且设置该记录为对比记录?)
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
                            {/* 开始日期在peroid内的不许set日期，包含peroid的不许set日期（弹提示报错），点了peroid内之后弹提示已经设置查询日期，点击查询捏，点在peroid以外的改为写入 */}
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
    )
})