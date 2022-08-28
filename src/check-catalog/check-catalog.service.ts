import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckCatalogService {
  private static checkCatalog = [];

  static async load() {
    const results = await getManager()
      .query('SELECT * FROM camdecmpsmd.vw_emissions_api_check_catalog_results');

    CheckCatalogService.checkCatalog = results.map(i => {
      const parts = i.resultMessage.split('[')
        .filter(i => i.includes(']'));
      return {
        code: `${i.checkTypeCode}-${i.checkNumber}-${i.resultCode}`,
        message: i.resultMessage,
        plugins: parts && parts.length > 0
          ? parts.map(i => i.split(']')[0])
          : [],
      }
    });
  }

  static formatMessage(message: string, values?: {}, plugins?: string[]) {
   
    if (!plugins || (plugins && plugins.length === 0)) {
      const parts = message.split('[').filter(i => i.includes(']'));
      plugins = parts && parts.length > 0
        ? parts.map(i => i.split(']')[0])
        : [];
    }

    if (plugins && values) {
      plugins.forEach((i: string) => {
        const parts = i.split(' ');
        let fieldname = parts[0];

        if (parts.length === 1) {
          fieldname = `${parts[0].charAt(0).toLowerCase()}${parts[0].slice(1)}`;
        } else {
          parts.forEach((p: string, index: number) => {
            if (index > 0) {
              fieldname = `${fieldname.toLowerCase()}${p.charAt(0).toUpperCase()}${p.slice(1)}`;
            }
          })
        }

        message = message.replace(`[${i}]`, `[${values[fieldname]}]`);
      });
    }

    return message;
  }

  static formatResultMessage = (code: string, values?: {}): string => {
    let message = `[${code}]`;
    const result = CheckCatalogService.checkCatalog.find(i => i.code === code);
    message = `${message} - ${result.message}`;
    return CheckCatalogService.formatMessage(message, values, result.plugins);
  }
}
