// 职位、人员储存表
// 要新增职位
import { Realm } from '@realm/react'
export class ArrangePeople extends Realm.Object<ArrangePeople> {
    _id!: Realm.BSON.ObjectId; // 主键
    name!: string; // 人员姓名
    index!: number; // 排序
    
    static generate(name: string, index: number) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name,
            index
        } as ArrangePeople;
    }

    static schema: Realm.ObjectSchema = {
        name: 'ArrangePeople',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            index: 'int'
        },
    };
}