import { Module } from "@nestjs/common";
import { EarliestPartitionQuarterChecksService } from "./earliest-partition-quarter-checks.service";

@Module({
    imports: [],
    controllers: [],
    providers: [EarliestPartitionQuarterChecksService],
    exports: [EarliestPartitionQuarterChecksService],
  })
  export class EarliestPartitionQuarterChecksModule {}
    