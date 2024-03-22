import { faker } from "@faker-js/faker";
import { DailyBackstopImportDTO } from "../../src/dto/daily-backstop.dto";

export const genDailyBackstopImportDto = (amount = 1) => {
    const dailyBackstopData: DailyBackstopImportDTO[] = [];

    for (let i = 0; i < amount; i++) {
        dailyBackstopData.push({
            unitId: faker.datatype.string(),            
            date: faker.datatype.datetime(),
            dailyNoxEmissions: faker.datatype.number(),
            dailyHeatInput: faker.datatype.number(),
            dailyAverageNoxRate: faker.datatype.number(),
            dailyNoxExceedence: faker.datatype.number(),
            cumulativeOsNoxExceedence: faker.datatype.number(),
        });
    }

    return dailyBackstopData;
};