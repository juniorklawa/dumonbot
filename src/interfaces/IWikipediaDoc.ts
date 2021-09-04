interface ISection {
  text: () => string;
}

interface IImage {
  json: () => {
    url: string;
  };
}

export interface IWikipediaDoc {
  sections: () => ISection[];
  images: () => IImage[];
  url: () => string;
}
