import { Text, TextInput, View, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { format } from "date-fns";
import { styles, modalStyles } from '@pages/ShiftArrange/css/ArrangeScreenCss'

import Clipboard from '@react-native-clipboard/clipboard';

export type ShareMsgRef = {
    open: () => void;
    close: () => void;
}
export const ShareMsg = forwardRef(({ dataList }: any, ref) => {
    const [modalVisible, setModalVisible]= useState<boolean>(false)
    const [text, setText]= useState<string>('')

    

    useImperativeHandle(ref, () => ({
        open: () => {
            console.log('打开捏，看看要渲染啥============>dataList', dataList)
            const tempText = formatText(dataList)
            setText(tempText)
            setModalVisible(true)
        },
        close: () => setModalVisible(false)
    }), [dataList])

    
    const btnConfirm = useCallback(() => {
        Clipboard.setString(text);
        Alert.alert('已复制');
    }, [text])

    const btnCancel = useCallback(() => {
        setText('')
        setModalVisible(false)
    }, [])

    const formatText = useCallback((curArrangeDataList: any): string => {
        const [positionType, startDate, endDate] = [curArrangeDataList[0].positionType, curArrangeDataList[0].startDate, curArrangeDataList[0].endDate]
        let [returnText, positionTypeText, startDateText, endDateText] = ['', '', format(startDate, 'yyyy.MM.dd'), format(endDate, 'yyyy.MM.dd')]
        switch (positionType) {
            case 0:
                positionTypeText = '早晚课排班'
                break;
            case 1:
                positionTypeText = '钟鼓排班'
                break;
            case 2:
                positionTypeText = '斋堂排班'
                break;
            default:
                break;
        }
        returnText += `${positionTypeText}\n\n`
        curArrangeDataList.forEach((item: any) => {
            const [positionName, name] = [item.positionName, item.name.join('\n')]
            returnText += `${positionName}:\n${name}\n\n`
        });
        returnText += `${startDateText}-${endDateText}`
        return returnText
    }, [dataList])

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
                            multiline
                            value={ text }
                            onChangeText={ setText }
                            editable={ false }
                            style={ modalStyles.shareMsgModal }
                        />
                        
                        <View style={ modalStyles.bottomView }>
                            <Pressable 
                                style={ ({ pressed }) => [modalStyles.bottomBtn, styles.samItemEdit, styles.bgYellow, pressed && styles.samItemActive] }
                                onPress={ btnConfirm }
                            >
                                <Text style={ modalStyles.btnText }>复制</Text>
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