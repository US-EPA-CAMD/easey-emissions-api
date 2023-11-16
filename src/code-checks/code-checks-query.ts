import { BaseEntity, Repository, getManager } from "typeorm";
import { ParameterCode } from "../entities/parameter-code.entity";

export const getInvalidCodes = async <EntityType extends BaseEntity>( codeSet: Set<string>, entityRepo: Repository<EntityType>) => {

    console.log(entityRepo.metadata.primaryColumns[0].databaseName)
    const tableName = entityRepo.metadata.tableName;
    const codeColumn = entityRepo.metadata.primaryColumns[0].databaseName;

    const manager = getManager();
    const codeList = Array.from(codeSet)

    const formattedCodes = codeList.map(code => `('${code}')`);
    const sql = `
    VALUES ${formattedCodes.join(",")}
    EXCEPT
    SELECT ${codeColumn} FROM ${tableName}
    `;

    console.log(sql)
    return await manager.query(sql)

}