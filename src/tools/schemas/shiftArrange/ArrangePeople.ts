// 职位、人员储存表
// 要新增职位
import { Realm } from '@realm/react'
export class ArrangePeople extends Realm.Object<ArrangePeople> {
    _id!: Realm.BSON.ObjectId; // 主键
    name!: string; // 人员姓名
    nameIndex!: number; // 排序
    isDel!: 0; // 是否被删除 0-否，1-是
    
    static generate(name: string, nameIndex: number, isDel: number = 0) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name,
            nameIndex,
            isDel
        } as ArrangePeople;
    }

    static schema: Realm.ObjectSchema = {
        name: 'ArrangePeople',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            nameIndex: 'int',
            isDel: 'int'
        },
    };
}