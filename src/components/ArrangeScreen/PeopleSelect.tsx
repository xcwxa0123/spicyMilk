import { Text, View, Pressable, ScrollView, Modal } from 'react-native';
import { useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { styles, modalStyles } from '@pages/ShiftArrange/css/ArrangeScreenCss'

export type PeopleSelectRef = {
    open: () => void;
    close: () => void;
}
export const PeopleSelect = forwardRef(({
    peopleList,
    curDataSelect,
    setCurDataSelect,
    selectBtnConfirm
}: any, ref) => {
    const [modalVisible, setModalVisible]= useState(false)

    useImperativeHandle(ref, () => ({
        open: () => {
            console.log('进里面来了捏================>', ref)
            setModalVisible(true)
        },
        close: () => setModalVisible(false)
    }))

        // 人员选择modal取消按钮
    const selectBtnCancel = useCallback(() => {
        // curdataselect不控制显示，只是预存当前数据，所以无论是否进来时有数据都统一清空名字，只有确定时才写入
        setCurDataSelect((prev: any) => ({ ...prev, name: [] }))
        setModalVisible(false)
    }, [])

    const getPeopleDisabled = useCallback((item: any) => {
        return (curDataSelect.name && curDataSelect.name.length && curDataSelect.name.findIndex((sp: string) => sp == item.name) != -1) ? true : false
    }, [curDataSelect.name])

    // 人员选择modal人员条目onpress
    // 因为每一次都是替换，所以不用管前一次是啥，这个可以写成缓存
    const peopleSelect = useCallback((item: any) => {
        console.log('看看选择的人---------------->', item)
        setCurDataSelect((prev: any) => ({ ...prev, name: [item.name] }))
    }, [])

    return (
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
                                            // isLastChoice(item) ? { borderColor: 'rgba(250, 240, 216, 1)' } : {}
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
    )
})