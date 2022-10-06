import { faker } from "@faker-js/faker";
import { SummaryValueImportDTO } from "../../src/dto/summary-value.dto";

export const genSummaryValueImportDto = (amount=1)=>{
    const summaryValues: SummaryValueImportDTO[] = [];
    
    let unitId = null;
    let stackPipeId = null;
    if( faker.datatype.boolean())
        unitId = faker.datatype.string();
    else
        stackPipeId = faker.datatype.string();

    for( let i=0; i < amount; i++ ){
        summaryValues.push({
            stackPipeId,
            unitId,
            parameterCode: faker.datatype.string(),
            currentReportingPeriodTotal: faker.datatype.number(),
            ozoneSeasonToDateTotal: faker.datatype.number(),
            yearToDateTotal: faker.datatype.number(),
        })
    }

    return summaryValues;
}