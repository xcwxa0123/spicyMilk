import { ImageBackground, Image, Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { useCallback, useEffect, useState, useLayoutEffect, useRef } from 'react';
import { getNavigation } from '@tools/naviHook'
import { getIconImage } from '@tools/initTable'
import { ArrangePosition, ArrangePeople } from '@tools/zeroExport'
import { styles } from './css/ArrangeScreenCss'
import { RouteList } from '@tools/route'
import { RouteProp } from '@react-navigation/native';
import { useRealm } from '@realm/react';


import { PeopleEdit, PeopleEditRef } from '@components/ArrangeScreen/PeopleEdit'
import { ConfirmModal, ConfirmModalRef } from '@components/ArrangeScreen/ConfirmModal'

const [
    peopleEditRef,
    peopleAddRef,
    confirmModalRef
] = [
    useRef<PeopleEditRef>(null),
    useRef<PeopleEditRef>(null),
    useRef<ConfirmModalRef>(null),
]

const realm = useRealm()

// 路由参数type，找RouteList中的ArrangeScreen，把它的参数类型赋给route
// -TODO日后整合到一起，就放输出路由的那里
type ASRouteParams = { route: RouteProp<RouteList, 'ManageScreen'> }

export function ManageScreen({ route }: ASRouteParams) {
    // initArrangeTable()
    const navigation = getNavigation();
    const [isEdit, setIsEdit] = useState(false); // 是否编辑
    const [curSelectItem, setCurSelectItem] = useState({name: '', _id: ''}); // 当前选中对象
        // arrangeItemList: Array.from(route.params.manageType == 1? peopleList : positionList)
    const [arrangeItemList, setArrangeItemList] = useState<any>([])
    
    useEffect(() => {
        // 初始查询
        let result = realm.objects('ArrangePeople')
        // 添加监听器
        const updateData = () => {
            setArrangeItemList(Array.from(result.filtered('isDel == $0', 0)))
        };
        result.addListener(updateData);

        // 清理监听器
        return () => {
            result.removeListener(updateData);
        };
    }, [realm, route.params.manageType]);

    // 导航栏加编辑图标
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={ styles.headerRightContainer }>
                    <Pressable 
                        style={ ({ pressed }) => [styles.rbtn, pressed && styles.rbtnActive] }
                        onPress={() => openAddPeople() }
                    >
                        <Image source={ getIconImage('add') } style={ [{ resizeMode: 'contain' }, { aspectRatio: 0.8, width: '50%' }] }></Image>
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
    const getSubText = useCallback((manageType: number) => {
        switch (manageType) {
            case 1: // 人员管理
                return '点击右上角加号添加名字\n点击右上角编辑图标进入编辑模式，编辑模式中点击人员进行名字修改，点击删除图标进行删除'
            case 2: // 职位管理
                return '点击右上角编辑图标进入编辑模式，编辑模式中点击职位进行名字修改，点击删除图标进行删除'
        }
    }, [])
    
    const openEditPeople = useCallback((item: any) => {
        setCurSelectItem(item)
        peopleEditRef.current?.open(item.name)
    }, [curSelectItem])

    const openDelPeople = useCallback((item: any) => {
        setCurSelectItem(item)
        console.log('看看这里set的==========>', item.name)
        confirmModalRef.current?.open()
    }, [curSelectItem])

    const openAddPeople = useCallback(() => {
        peopleAddRef.current?.open('')
    }, [curSelectItem])
    
    const editPeople = useCallback((item: any) => {
        console.log('点击编辑============>', item)
        console.log('查看当前============>', curSelectItem!['name'])
        try {
            realm.write(() => {
                let updateRes: any = realm.objects('ArrangePeople').filtered('_id == $0 AND isDel == $1', curSelectItem!['_id'], 0)[0]
                updateRes.name = item
            });
            Alert.alert('修改成功')
        } catch (error) {
            Alert.alert(`修改失败，错误原因：${error}`)
            console.log('error=====>', error)
        }
    }, [curSelectItem])

    const delPeople = useCallback((item: any) => {
        console.log('点击删除lenient============>', item)
        try {
            realm.write(() => {
                let delRes: any = realm.objects('ArrangePeople').filtered('_id == $0 AND isDel == $1', curSelectItem!['_id'], 0)[0]
                console.log('看看要删除的=======>', delRes)
                // realm.delete(delRes)
                delRes.isDel = 1
            });
            Alert.alert('删除成功')
        } catch (error) {
            Alert.alert(`删除失败，错误原因：${error}`)
            console.log('error=====>', error)
        }
    }, [curSelectItem])

    const addPeople = useCallback((item: any) => {
        console.log('点击添加============>', item)
        try {
            realm.write(() => {
                const data = ArrangePeople.generate(item, 1, 0)
                realm.create(ArrangePeople, data)
            });
            Alert.alert('添加成功')
        } catch (error) {
            Alert.alert(`添加失败，错误原因：${error}`)
            console.log('error=====>', error)
        }
    }, [curSelectItem])


    return (
        <ImageBackground source={ getIconImage('backgroundImage') } resizeMode='cover' style={ styles.ibg }>
            
            <PeopleEdit
                name={ curSelectItem!['name'] }
                callBackFunc={ editPeople }
                ref={ peopleEditRef }
            ></PeopleEdit>
            <PeopleEdit
                name={ '' }
                callBackFunc={ addPeople }
                ref={ peopleAddRef }
            ></PeopleEdit>
            <ConfirmModal
                confirmText={ `确定要删除${curSelectItem['name']}吗？` }
                callBackFunc={ delPeople }
                data={ curSelectItem }
                ref={ confirmModalRef }
            ></ConfirmModal>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false} // 隐藏滚动条（可选）
            >
                <Text style={ styles.topText }>{ route.params.title }</Text>
                <Text style={ styles.secondText }>{ getSubText(route.params.manageType) }</Text>
                <View style={ styles.samList }>
                    {
                        arrangeItemList.map((item: any, index: number) => (
                            (<Pressable
                                style={ ({ pressed }) => [styles.samItem, isEdit && styles.samItemEdit, { backgroundColor: item.backgroundColor }, pressed && styles.samItemActive] }
                                key={ index }
                                onPress={() => openEditPeople(item)}
                                disabled={ !isEdit }
                            >
                                <Text style={ [styles.samItemText, {}] }>| { index + 1 } { route.params.manageType == 1? item.name : item.positionName }</Text>
                                { isEdit? 
                                <Pressable
                                    onPress={() => openDelPeople(item)}
                                    style={ ({ pressed }) => [pressed && styles.samItemActive] }    
                                >
                                    <Image 
                                        source={getIconImage('delete')} 
                                        resizeMode="contain" 
                                        style={ [{ marginRight: 30 }] } 
                                    ></Image>
                                </Pressable> : null }
                            </Pressable>)
                        ))
                    }
                </View>
            </ScrollView>
        </ImageBackground>
    )
}