import { Injectable } from "@nestjs/common";
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EmissionsImportDTO } from "../dto/emissions.dto";
import { DailyEmissionImportDTO } from "../dto/daily-emission.dto";
import { getCodeMap } from "./code-map-generator";
import { isUndefinedOrNull } from "../utils/utils";
import { getInvalidCodes } from "./code-checks-query";
import { ParameterCode } from "../entities/parameter-code.entity";

@Injectable()
export class CodeChecksService {
    
    codesMap: Map<string, Set<string>>;

    constructor(private readonly logger: Logger) {
        this.logger.setContext('CodeChecksService');
        this.codesMap = getCodeMap();
    }


    async runChecks(payload: EmissionsImportDTO): Promise<string[]>{
        this.logger.log('Running Code Checks');

        const errorList = [];
        this.collectDailyEmissionsCodes(payload.dailyEmissionData);
        console.log('this.codesMap.get("parameterCode")')
        console.log(Array.from(this.codesMap.get("parameterCode")))
        const invalidCodes = await getInvalidCodes<ParameterCode>(this.codesMap.get("parameterCode"), ParameterCode.getRepository());
        console.log("invalidCodes: ")
        console.log(invalidCodes)
        const parameterCodeErrors = invalidCodes.map(invalidCodeObj => `You reported an invalid parameterCode of ${invalidCodeObj.column1}.`)

        errorList.push(...parameterCodeErrors)
        return errorList;
    }

    collectDailyEmissionsCodes(payload: DailyEmissionImportDTO[]){
        payload.forEach(dailyEm =>{
            if( isUndefinedOrNull(dailyEm.parameterCode) )
                return;
            
            const codeSet: Set<string> = this.codesMap.get("parameterCode");
            codeSet.add(dailyEm.parameterCode);
        });
    }
}

