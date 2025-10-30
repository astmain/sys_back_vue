// 定义装饰器接口
interface ColumnOptions {
    db?: 'unique' | 'id';
    BigInt?: true | false;
    children?: true | false;
    updatedAt?: true | false;
    createdAt?: true | false;
    refmany?: string;
    // Json?: 'JsonArr' | 'JsonObj';
}

// 创建Column装饰器
export function Column(options?: ColumnOptions) {
    return function(target: any, propertyKey: string) {
        // 存储装饰器元数据
        Reflect.defineMetadata('Column:db', options?.db, target, propertyKey);
        Reflect.defineMetadata('Column:children', options?.children, target, propertyKey);
        Reflect.defineMetadata('Column:refmany', options?.refmany, target, propertyKey);
        Reflect.defineMetadata('Column:BigInt', options?.BigInt, target, propertyKey);
        Reflect.defineMetadata('Column:updatedAt', options?.updatedAt, target, propertyKey);
        Reflect.defineMetadata('Column:createdAt', options?.createdAt, target, propertyKey);
        // Reflect.defineMetadata('Column:Json', options?.createdAt, target, propertyKey);  //已经做了处理
    };
}
