import { IContent } from '../models/IContent';

const fs = require('fs');

const saveSnapShot = (content: IContent): void => {
  const formattedSubjectName = content.searchTerm
    .replace(/ /g, '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  fs.writeFile(
    `${formattedSubjectName}.json`,
    JSON.stringify(formattedSubjectName),
    function (err: string) {
      if (err) {
        console.log(err);
      }
      console.log(`${formattedSubjectName} > ${formattedSubjectName}.json`);
    },
  );
};

export default saveSnapShot;
