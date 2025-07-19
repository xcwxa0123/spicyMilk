
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    headerRightContainer: {
        flexDirection: 'row',
        gap: 8, // RN 0.71+ 支持 gap 属性
        marginRight: 10,
    },
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
        height: 50, // 推荐 36~44，适配 header 高度
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
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

export const modalStyles = StyleSheet.create({
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
    },
    shareMsgModal: {
        backgroundColor: 'rgba(179, 179, 179, 1)',
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 30,
        margin: 50,
        marginTop: 30,
        borderRadius: 10,
        padding: 30
    }
})
