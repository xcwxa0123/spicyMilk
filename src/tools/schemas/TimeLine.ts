import { Realm } from '@realm/react'

export class TimeLine extends Realm.Object<TimeLine> {
    _id!: Realm.BSON.ObjectId; // 主键，唯一值
    actFrom!: string; // 发动对象的名字（有可能双目标或者多目标）
    name!: string; // 技能名称
    nameEN!: string; // 技能名称英文
    nameJP!: string; // 技能名称日文
    desc!: string; // 技能描述
    range!: string; // 作用范围
    damage!: number; // 伤害
    startAt!: number; // 技能发动开始时间点
    // endAt!: number; // 技能发动结束时间点
    // dungeonID!: Realm.BSON.ObjectId; // 副本主键，出自TimeLineSum
    pic?: string; // 图片存放地址
    // dungeonName!: Realm.Results<TimeLineSum>; // 父链


    static generate(
        actFrom: string, 
        name: string, 
        nameEN: string = name, 
        nameJP: string = name, 
        desc: string = '', 
        range: string, 
        damage: number, 
        startAt: number, 
        // endAt: number, 
        // dungeonID: Realm.BSON.ObjectId, 
        pic: string = ''
    ) {
        return {
            _id: new Realm.BSON.ObjectId(),
            actFrom,
            name,
            nameEN,
            nameJP,
            desc,
            range,
            damage,
            startAt,
            // endAt,
            // dungeonID,
            pic
        } as TimeLine;
    }

    static schema: Realm.ObjectSchema = {
        name: 'TimeLine',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            actFrom: 'string',
            name: 'string',
            nameEN: 'string',
            nameJP: 'string',
            desc: 'string',
            range: 'string',
            damage: 'int',
            startAt: 'int',
            pic: 'string',
            // endAt: 'int',
            // dungeonID: 'objectId',
            // dungeonName: { // 反向链接父级
            //     type: 'linkingObjects', // 反向关联时必须用这个类型
            //     objectType: 'TimeLineSum', // 父表类型
            //     property: 'timeLine' // 关联到父表的哪个字段
            // }
        },
    };
}

export function createTimeLine(dungeonName: string) {
    const Dungeon = class extends TimeLine {}
    Dungeon.schema = {
        ...TimeLine.schema,
        name: dungeonName
    }
    return Dungeon
}