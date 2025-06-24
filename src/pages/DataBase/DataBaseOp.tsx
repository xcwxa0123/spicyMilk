import { Text, View, FlatList, StyleSheet, StatusBar, Pressable  } from 'react-native';
import { dataDeal } from '@assets/The Epic of Alexander'
import { Button } from '@react-navigation/elements';
import { ROUTE } from '@tools/route'
import { getNavigation, RouteProps } from '@tools/naviHook'
import { useRealm } from '@realm/react';
import { Main, DungeonCategory, TimeLineSum, TimeLine, createTimeLine } from '@tools/zeroExport'
import SQLite from 'react-native-sqlite-storage';

interface ItemProps { data: { [key: string]: any } }
const realm = useRealm()

const navigator = getNavigation()

const db = SQLite.openDatabase(
    { name: 'dungeons.db', location: 'default' },
    () => console.log('数据库连接成功'),
    error => console.log('数据库连接错误', error)
);

const DCItem = ({ data }: ItemProps) => (
    <Pressable style={styles.item} onPress={ () => navigator.setParams({ dbName: 'TimeLineSum', categoryKey: data.categoryKey}) }>
        <Text>对象名字: {data.categoryName}</Text>
        <Text>对象描述: {data.categoryDesc}</Text>
        <Text>对象主键: {data.categoryKey}</Text>
        <Text>图片地址: {data.categoryPic}</Text>
        <Button style={styles.item} onPress={dataPlusDC}>++++</Button>
    </Pressable>
);

const TLSItem = ({ data }: ItemProps) => (
    // <Pressable style={styles.item} onPress={ () => dataPlus(data.dungeonNameEN) }>
    <Pressable style={styles.item} onPress={ () => getSqliteDat(data.dungeonNameEN) }>
        {/* <Text>id: {data._id}</Text> */}
        <Text>副本类型: {data.categoryKey}</Text>
        <Text>副本名称: {data.dungeonName}</Text>
        <Text>副本英文名称: {data.dungeonNameEN}</Text>
        <Text>副本日文名称: {data.dungeonNameJP}</Text>
        <Text>副本等级: {data.level}</Text>
        <Text>图片地址: {data.dungeonPic}</Text>
    </Pressable>
)

const getSqliteDat = (dungeonNameEN: string) => {
    const tableName = dungeonNameEN.split(/\s+/).join('_')
    db.transaction(tx => {
        tx.executeSql(
            `SELECT * FROM ${ tableName }`,
            [],
            (_, data) => console.log('查询成功========>', data.rows.raw()),
            (_, error) => console.log('查询失败', error)
        )
    })
}

const dataPlusDC = () => {
    realm.write(() => {
        const data = TimeLineSum.generate(2, '亚历山大绝境战', 'The Epic of Alexander', '絶アレキサンダー討滅戦', 80)
        realm.create('TimeLineSum', data)
    })

}

const dataPlus = (dungeonNameEN: string) => {
    console.log('dungeonNameEN==========>',dungeonNameEN)
    const tableName = dungeonNameEN.split(/\s+/).join('_')
    console.log('tableName==========>',tableName)
    let startDate = new Date().getTime()
    const data = dataDeal()
    let endDate = new Date().getTime()
    console.log( `数据处理用了${endDate - startDate}` )
    startDate = new Date().getTime()
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${tableName} (
                _id INTEGER PRIMARY KEY AUTOINCREMENT, 
                actFrom TEXT,
                name TEXT,
                nameEN TEXT,
                nameJP TEXT,
                desc TEXT,
                range TEXT,
                damage INTEGER,
                startAt INTEGER,
                pic TEXT
            )`,
            [],
            () => console.log(`${tableName}表创建成功`),
            (_, error) => console.log(`创建${tableName}表错误`, error)
        )
        tx.executeSql(
            `CREATE INDEX IF NOT EXISTS idx_startAt ON ${tableName}(startAt)`,
            [],
            () => console.log(`${tableName}表索引创建成功`),
            (_, error) => console.log('创建索引错误', error)
        )

        data.forEach(d => {
            tx.executeSql(
                `INSERT INTO ${tableName} (
                    actFrom,
                    name,
                    nameEN,
                    nameJP,
                    desc,
                    range,
                    damage,
                    startAt,
                    pic
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )`,
                d,
                () => console.log('√'),
                (_, error) => console.log(`${d}本条数据插入错误`, error)
            )
        })
    })
    endDate = new Date().getTime()
    console.log( `写入用了${endDate - startDate}` )
}

// type ResultType = Main | DungeonCategory | TimeLineSum | TimeLine;
export const DataBaseOp = ({ route }: RouteProps) => {
    console.log('又进来了捏', route.params.dbName)
    // const [result, setResult] = useState(realm.objects(route.params.dbName))
    let result = realm.objects(route.params.dbName)
    console.log('result+++++++++++++++++++++>', result)
    console.log('类型+++++++++++++++++++++>', result[0])
    return (
        <View style={styles.container}>
            <FlatList
                data={ result }
                renderItem={
                    ({ item }) => {
                        switch (route.params.dbName) {
                            case 'DungeonCategory': // 最上层，种类筛选
                                return <DCItem data={ item } />
                            case 'TimeLineSum': // 中层 副本筛选
                                return <TLSItem data={ item } />
                            // case 'TimeLine': // 底层 sqlite
                            //     return <TLItem data={ item }/>


                            default:
                                return <Text>无</Text>
                        }
                    }
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
    },
    header: {
        fontSize: 32,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
    },
});