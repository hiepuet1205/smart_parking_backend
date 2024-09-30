export class BaseSerialize {
  DEFAULT = [];

  constructor(
    readonly object: any,
    readonly options: any = {},
  ) {
    Object.assign(this, object);
  }

  perform(): Record<string, any> {
    // Lấy danh sách các thuộc tính cần trả về của instance
    const properties = this[this.options.type || 'DEFAULT'];

    // Tạo một object để lưu trữ kết quả
    const result: Record<string, any> = {};

    // Lặp qua từng thuộc tính thông qua const và gán giá trị tương ứng vào object result
    properties.forEach((property) => {
      result[property] = this[property];
    });

    return result;
  }
}
