// 职位、人员储存表
// 要新增职位
import { Realm } from '@realm/react'
export class ArrangeList extends Realm.Object<ArrangeList> {
    _id!: Realm.BSON.ObjectId; // 主键
    positionId!: Realm.BSON.ObjectId; // 职位ID
    positionType!: number; // 职位所属类别 比如晨钟暮鼓类别
    positionName!: string; // 职位名
    positionIndex!: number; // 排序用
    isMultiple!: boolean; // 是否多选
    imgIndex!: number; // 图片
    name!: Array<string>; // 人员姓名
    startDate!: Date; // 开始日期
    endDate!: Date; // 结束日期

    static generate(positionId: Realm.BSON.ObjectId, positionType: number, positionName: string, positionIndex: number, isMultiple: boolean, imgIndex: number, name: Array<string>, startDate: Date, endDate: Date) {
        return {
            _id: new Realm.BSON.ObjectId(),
            positionId,
            positionType,
            positionName,
            positionIndex,
            isMultiple,
            imgIndex,
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
            positionId: 'objectId',
            positionType: 'int',
            positionName: 'string',
            positionIndex: 'int',
            isMultiple: 'bool',
            imgIndex: 'int',
            name: 'string[]',
            startDate: { type: 'date', indexed: true },
            endDate: 'date'
        },
    };
}