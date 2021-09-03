import ICustomSearchProvider from '../../classes/interfaces/ICustomSearchProvider';

export interface ICustomSearchItem {
  link: string;
}

export interface ICustomSearchData {
  data: { items: ICustomSearchItem[] };
}

export default class FakeCustomSearchProvider implements ICustomSearchProvider {
  async getSearchResult(
    _googleSearchQuery: string,
  ): Promise<ICustomSearchData> {
    const items = [
      {
        link: 'https://i.ytimg.com/vi/I8jf8muKbEA/maxresdefault.jpg',
      },
      {
        link: 'https://i.ytimg.com/vi/I8jf8muKbEA/maxresdefault.jpg',
      },
    ];

    return {
      data: { items },
    };
  }
}
