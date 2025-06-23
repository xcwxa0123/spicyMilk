// 职位、人员储存表
// 要新增职位
import { Realm } from '@realm/react'
export class ArrangeList extends Realm.Object<ArrangeList> {
    _id!: Realm.BSON.ObjectId; // 主键
    positionName!: string; // 职位
    positoinType!: number; // 职位所属类别 比如晨钟暮鼓类别
    name!: string; // 人员姓名
    startDate!: Date; // 开始日期
    endDate!: Date; // 结束日期

    static generate(positionName: string, positoinType: number, name: string, startDate: Date, endDate: Date) {
        return {
            _id: new Realm.BSON.ObjectId(),
            positionName,
            positoinType,
            name,
            startDate,
            endDate
        } as ArrangeList;
    }

    static schema: Realm.ObjectSchema = {
        name: 'ArrangeList',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            positionName: 'string',
            positoinType: 'int',
            name: 'string',
            startDate: 'date',
            endDate: 'date'
        },
    };
}