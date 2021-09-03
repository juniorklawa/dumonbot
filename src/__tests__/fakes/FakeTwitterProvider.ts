export default class FakeTwitterProvider {
  async post(
    _method: string,
    _data: unknown,
    _callback: () => void,
  ): Promise<void> {
    return new Promise(resolve => {
      resolve();
    });
  }
}
