import { QueryBuilderHelper } from './query-builder.helper';

describe('QueryBuilderHelper.whereControlTech', () => {
  const alias = 'aud';
  const params = ['controlTechnologies'];

  const SNCR_STORED = 'Selective Non-catalytic Reduction';
  const SCR_STORED = 'Selective Catalytic Reduction';

  const makeQuery = () => ({
    andWhere: jest.fn().mockReturnThis(),
  });

  const extractPatterns = (query: ReturnType<typeof makeQuery>): RegExp[] =>
    Object.values(query.andWhere.mock.calls[0][1]).map(
      (pattern) => new RegExp(pattern as string, 'i'),
    );

  const matchesAny = (
    query: ReturnType<typeof makeQuery>,
    data: string,
  ): boolean => extractPatterns(query).some((regex) => regex.test(data));

  it('matches SNCR in the end position of a pipe-delimited string (Barry case)', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    expect(
      matchesAny(
        query,
        'Low NOx Burner Technology w/ Closed-coupled OFA|Selective Non-catalytic Reduction',
      ),
    ).toBe(true);
  });

  it('matches SNCR in the start position of a pipe-delimited string', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    expect(
      matchesAny(
        query,
        'Selective Non-catalytic Reduction|Low NOx Burner Technology w/ Separated OFA',
      ),
    ).toBe(true);
  });

  it('matches SNCR when the column value contains only that single value', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    expect(matchesAny(query, 'Selective Non-catalytic Reduction')).toBe(true);
  });

  it('does not match SNCR against an SCR-only pipe-delimited string', () => {
    const query = makeQuery();
    QueryBuilderHelper.whereControlTech(query, [SNCR_STORED], params, alias);
    expect(
      matchesAny(query, 'Dry Low NOx Burners|Selective Catalytic Reduction'),
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
    expect(
      matchesAny(
        query,
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

  it('binds control-technology text instead of adding it to SQL', () => {
    const query = makeQuery();
    const payload = "' OR TRUE OR control_info LIKE '";

    QueryBuilderHelper.whereControlTech(query, [payload], params, alias);

    const [sql, parameters] = query.andWhere.mock.calls[0];
    expect(sql).toContain(':controlTechnologyRegex0');
    expect(sql).not.toContain(payload.toUpperCase());
    expect(parameters.controlTechnologyRegex0).toContain(payload.toUpperCase());
  });

  it('binds location names instead of adding them to SQL', () => {
    const query = makeQuery();
    const payload = "' OR TRUE --";

    QueryBuilderHelper.whereLocationName(query, [payload], alias);

    const [sql, parameters] = query.andWhere.mock.calls[0];
    expect(sql).toContain(':...locationNames');
    expect(sql).not.toContain(payload);
    expect(parameters).toEqual({ locationNames: [payload] });
  });
});
