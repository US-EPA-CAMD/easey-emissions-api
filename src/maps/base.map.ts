export abstract class BaseMap<E, T> {
  public abstract one(entity: E): Promise<T>;

  public many(values: E[]): Promise<T[]> {
    return Promise.all<T>(values.map(v => this.one(v)));
  }
}
