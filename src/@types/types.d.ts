type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

interface StringMap {
  [key: string]: any;
}
