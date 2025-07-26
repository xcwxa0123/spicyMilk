import { Text, TextInput, View, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { styles, modalStyles } from '@pages/ShiftArrange/css/ArrangeScreenCss'

export type PeopleEditRef = {
    open: (inputName: string) => void;
    close: () => void;
}
export const PeopleEdit = forwardRef(({ name, callBackFunc }: any, ref) => {
    const [modalVisible, setModalVisible]= useState<boolean>(false)
    const [text, setText]= useState<string>('')

    

    useImperativeHandle(ref, () => ({
        open: (inputName: string) => {
            console.log('打开捏，看看要渲染啥============>dataList', inputName)
            // const tempText = formatText(name)
            setText(inputName)
            setModalVisible(true)
        },
        close: () => setModalVisible(false)
    }), [name])

    
    const btnConfirm = useCallback(() => {
        // Clipboard.setString(text);
        // Alert.alert('编辑点击了捏');
        callBackFunc(text)
        setModalVisible(false)
    }, [text])

    const btnCancel = useCallback(() => {
        setText('')
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
                    <View style={ [modalStyles.selectView] }>
                         <TextInput
                            // style={styles.textarea}
                            // multiline
                            value={ text }
                            onChangeText={ setText }
                            editable={ true }
                            style={ [modalStyles.shareMsgModal, { backgroundColor: '#fff' }] }
                        />
                        
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