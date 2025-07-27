import { Text, View, Pressable, ScrollView, Modal } from 'react-native';
import { useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { styles, modalStyles } from '@pages/ShiftArrange/css/ArrangeScreenCss'

export type MultiPeopleSelectRef = {
    open: () => void;
    close: () => void;
}
export const MultiPeopleSelect = forwardRef(({
    peopleList,
    curDataSelect,
    setCurDataSelect,
    selectBtnConfirm
}: any, ref) => {
    const [multipleModalVisible, setMultipleModalVisible] = useState(false); // 多选modal显隐

    useImperativeHandle(ref, () => ({
        open: () => {
            console.log('进里面来了捏================>', ref)
            setMultipleModalVisible(true)
        },
        close: () => setMultipleModalVisible(false)
    }))

        // 人员选择modal取消按钮
    const selectBtnCancel = useCallback(() => {
        // curdataselect不控制显示，只是预存当前数据，所以无论是否进来时有数据都统一清空名字，只有确定时才写入
        setCurDataSelect((prev: any) => ({ ...prev, name: [] }))
        setMultipleModalVisible(false)
    }, [])
    
    const getMultiDisable = useCallback((item: any) => {
        return (curDataSelect.name && curDataSelect.name.length && curDataSelect.name.findIndex((sp: string) => sp == item.name) != -1) ? true : false
    }, [curDataSelect.name])

    // 多选人员选择界面的人员条目onpress
    // 每一次动会根据上一次的逻辑，所以需要以来curDataSelect
    const multiPeopleSelect = useCallback((item: any) => {
        console.log('看看选择的人---------------->', item)
        setCurDataSelect((prev: any) => {
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

    return (
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
                                            // isLastChoice(item) ? { borderColor: 'rgba(250, 240, 216, 1)' } : {}
                                        ] 
                                    }
                                    key={ index }
                                    onPress={ _ => multiPeopleSelect(item) }
                                >
                                    <Text style={ modalStyles.selectItemText }>{ item.name }</Text>
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
    )
})