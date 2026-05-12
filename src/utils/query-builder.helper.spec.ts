import { QueryBuilderHelper } from './query-builder.helper';

describe('QueryBuilderHelper.whereControlTech', () => {
  const alias = 'aud';
  const params = ['controlTechnologies'];

  const SNCR_STORED = 'Selective Non-catalytic Reduction';
  const SCR_STORED = 'Selective Catalytic Reduction';

  const makeQuery = () => ({
    andWhere: jest.fn().mockReturnThis(),
  });

  const extractPatterns = (sql: string): RegExp[] => {
    const out: RegExp[] = [];
    let i = 0;
    while (i < sql.length) {
      const idx = sql.indexOf('~*', i);
      if (idx === -1) break;
      let j = idx + 2;
      while (j < sql.length && sql[j] === ' ') j++;
      if (sql[j] !== '(') {
        i = j;
        continue;
      }
      let depth = 0;
      let inClass = false;
      const start = j;
      let end = -1;
      for (; j < sql.length; j++) {
        const c = sql[j];
        if (inClass) {
          if (c === ']') inClass = false;
          continue;
        }
        if (c === '[') {
          inClass = true;
        } else if (c === '(') {
          depth++;
        } else if (c === ')') {
          depth--;
          if (depth === 0) {
            end = j + 1;
            break;
          }
        }
      }
      if (end > 0) {
        try {
          out.push(new RegExp(sql.substring(start, end), 'i'));
        } catch {
          // Ignore patterns that fail to compile in JS (none expected with
          // the current pipeDelimited output, but be defensive).
        }
        i = end;
      } else {
        i = j;
      }
    }
    return out;
  };

  const matchesAny = (sql: string, data: string): boolean =>
    extractPatterns(sql).some(r => r.test(data));

  it('matches SNCR in the end position of a pipe-delimited string (Barry case)', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    const sql = query.andWhere.mock.calls[0][0];
    expect(
      matchesAny(
        sql,
        'Low NOx Burner Technology w/ Closed-coupled OFA|Selective Non-catalytic Reduction',
      ),
    ).toBe(true);
  });

  it('matches SNCR in the start position of a pipe-delimited string', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    const sql = query.andWhere.mock.calls[0][0];
    expect(
      matchesAny(
        sql,
        'Selective Non-catalytic Reduction|Low NOx Burner Technology w/ Separated OFA',
      ),
    ).toBe(true);
  });

  it('matches SNCR when the column value contains only that single value', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    const sql = query.andWhere.mock.calls[0][0];
    expect(matchesAny(sql, 'Selective Non-catalytic Reduction')).toBe(true);
  });

  it('does not match SNCR against an SCR-only pipe-delimited string', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    const sql = query.andWhere.mock.calls[0][0];
    expect(
      matchesAny(sql, 'Dry Low NOx Burners|Selective Catalytic Reduction'),
    ).toBe(false);
  });

  it('matches the Barry end-position string when [SCR, SNCR] are both selected (multi-select union via the SNCR branch)', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(
      query,
      [SCR_STORED, SNCR_STORED],
      params,
      alias,
    );
    const sql = query.andWhere.mock.calls[0][0];
    expect(
      matchesAny(
        sql,
        'Low NOx Burner Technology w/ Closed-coupled OFA|Selective Non-catalytic Reduction',
      ),
    ).toBe(true);
  });

  it('does not add an andWhere when the control-tech filter is absent', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, undefined, params, alias);
    expect(query.andWhere).not.toHaveBeenCalled();
  });

  it('adds a predicate covering each of the four *ControlInfo columns', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    expect(query.andWhere).toHaveBeenCalledTimes(1);
    const sql = query.andWhere.mock.calls[0][0];
    expect(sql).toContain('so2ControlInfo');
    expect(sql).toContain('noxControlInfo');
    expect(sql).toContain('pmControlInfo');
    expect(sql).toContain('hgControlInfo');
  });
});