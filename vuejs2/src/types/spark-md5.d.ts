declare module 'spark-md5' {
  export default class SparkMD5 {
    static hashBinary(content: string): string;
    static hash(content: string): string;
    static hashArray(content: Array<number>): Array<number>;
  }
}
