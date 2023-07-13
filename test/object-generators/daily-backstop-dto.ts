import { faker } from "@faker-js/faker";
import { DailyBackstopImportDTO } from "../../src/dto/daily-backstop.dto";

export const genDailyBackstopImportDto = (amount = 1) => {
    const dailyBackstopData: DailyBackstopImportDTO[] = [];

    for (let i = 0; i < amount; i++) {
        dailyBackstopData.push({
            unitId: faker.datatype.string(),            
            date: faker.datatype.datetime(),
            dailyNOxEmissions: faker.datatype.number(),
            dailyHeatInput: faker.datatype.number(),
            dailyAverageNOxRate: faker.datatype.number(),
            dailyNOxExceedence: faker.datatype.number(),
            cumulativeOSNOxExceedence: faker.datatype.number(),
        });
    }

    return dailyBackstopData;
};