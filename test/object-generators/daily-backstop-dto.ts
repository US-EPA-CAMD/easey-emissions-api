import { faker } from "@faker-js/faker";
import { DailyBackstopImportDTO } from "../../src/dto/daily-backstop.dto";

export const genDailyBackstopImportDto = (amount = 1) => {
    const dailyBackstopData: DailyBackstopImportDTO[] = [];

    for (let i = 0; i < amount; i++) {
        dailyBackstopData.push({
            unitId: faker.string.sample(),
            date: faker.date.anytime(),
            dailyNoxEmissions: faker.number.int(),
            dailyHeatInput: faker.number.int(),
            dailyAverageNoxRate: faker.number.int(),
            dailyNoxExceedance: faker.number.int(),
            cumulativeOsNoxExceedance: faker.number.int(),
        });
    }

    return dailyBackstopData;
};