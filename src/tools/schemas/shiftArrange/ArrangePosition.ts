// 职位、人员储存表
// 要新增职位
import { Realm } from '@realm/react'
export class ArrangePosition extends Realm.Object<ArrangePosition> {
    _id!: Realm.BSON.ObjectId; // 主键
    positionName!: string; // 职位名
    positoinType!: number; // 职位所属类别 比如晨钟暮鼓类别 首页根据type进行选出

    static generate(positionName: string, positoinType: number) {
        return {
            _id: new Realm.BSON.ObjectId(),
            positionName,
            positoinType
        } as ArrangePosition;
    }

    static schema: Realm.ObjectSchema = {
        name: 'ArrangePosition',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            positionName: 'string',
            positoinType: 'int',
        },
    };
}