import {GameType, ImageType} from '../data/game-data';

const localTypeMapper = {
  'two-of-two': GameType.TwoOfTwo,
  'one-of-three': GameType.OneOfThree,
  'tinder-like': GameType.OneOfOne
};

const localAnswerTypeMapper = {
  'painting': ImageType.PAINT,
  'photo': ImageType.PHOTO,
};

const localTasksMapper = (tasks) => tasks.map((task) => {
  return {
    src: task[`image`][`url`],
    type: localAnswerTypeMapper[task[`type`]],
    width: task[`image`][`width`],
    height: task[`image`][`height`],
  };
});


export const adaptServerData = (data) => data.map((item) => {
  return {
    question: item[`question`],
    gameType: localTypeMapper[item[`type`]],
    tasks: localTasksMapper(item[`answers`])
  };
});

export default adaptServerData;
