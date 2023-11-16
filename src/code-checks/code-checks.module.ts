import { Module } from "@nestjs/common";
import { CodeChecksService } from "./code-checks.service";

@Module({
    imports: [],
    controllers: [],
    providers: [CodeChecksService],
    exports: [CodeChecksService],
  })
  export class CodeChecksModule {}
    