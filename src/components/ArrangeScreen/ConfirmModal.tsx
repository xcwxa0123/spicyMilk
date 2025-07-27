import { Text, TextInput, View, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { styles, modalStyles } from '@pages/ShiftArrange/css/ArrangeScreenCss'

export type ConfirmModalRef = {
    open: () => void;
    close: () => void;
}
export const ConfirmModal = forwardRef(({ confirmText, data, callBackFunc }: any, ref) => {
    const [modalVisible, setModalVisible]= useState<boolean>(false)
    const [outPutData, setOutPutData] = useState()


    useImperativeHandle(ref, () => ({
        open: () => {
            console.log('打开捏，看看要渲染啥============>dataList', data)
            // const tempText = formatText(name)
            setOutPutData(data)
            setModalVisible(true)
        },
        close: () => setModalVisible(false)
    }), [data])

    
    const btnConfirm = useCallback(() => {
        // Clipboard.setString(text);
        callBackFunc(outPutData)
        setModalVisible(false)
    }, [outPutData])

    const btnCancel = useCallback(() => {
        setModalVisible(false)
    }, [])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={ btnCancel }
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={true} // 隐藏滚动条（可选）
            >
                {/* 人员选择modal */}
                <View style={ modalStyles.modalView }>
                    <View style={ [modalStyles.selectView, { flex: 0 }] }>
                        <Text style={ [styles.topText, {}] }>{ confirmText }</Text>
                        <View style={ modalStyles.bottomView }>
                            <Pressable 
                                style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgYellow, pressed && styles.samItemActive] }
                                onPress={ btnConfirm }
                            >
                                <Text style={ modalStyles.btnText }>确认</Text>
                            </Pressable>
                            <Pressable 
                                style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgWhite, pressed && styles.samItemActive ] }
                                onPress={ btnCancel }
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