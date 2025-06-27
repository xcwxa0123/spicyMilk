// 职位、人员储存表
// 要新增职位
import { Realm } from '@realm/react'
export class ArrangeList extends Realm.Object<ArrangeList> {
    _id!: Realm.BSON.ObjectId; // 主键
    positionId!: Realm.BSON.ObjectId; // 职位ID
    positoinType!: number; // 职位所属类别 比如晨钟暮鼓类别
    positoinName!: string; // 职位名
    positionIndex!: number; // 排序用
    isMultiple!: boolean; // 是否多选
    name!: Array<string>; // 人员姓名
    nameId!: Realm.BSON.ObjectId; // 人员ID
    startDate!: Date; // 开始日期
    endDate!: Date; // 结束日期

    static generate(positionId: Realm.BSON.ObjectId, positoinType: number, positoinName: string, positionIndex: number, isMultiple: boolean, name: Array<string>, nameId: Realm.BSON.ObjectId, startDate: Date, endDate: Date) {
        return {
            _id: new Realm.BSON.ObjectId(),
            positionId,
            positoinType,
            positoinName,
            positionIndex,
            isMultiple,
            name,
            nameId,
            startDate,
            endDate
        } as ArrangeList;
    }

    static schema: Realm.ObjectSchema = {
        name: 'ArrangeList',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            positionId: 'objectId',
            positoinType: 'int',
            positoinName: 'string',
            positionIndex: 'int',
            isMultiple: 'bool',
            name: 'string[]',
            nameId: 'objectId',
            startDate: { type: 'date', indexed: true },
            endDate: 'date'
        },
    };
}