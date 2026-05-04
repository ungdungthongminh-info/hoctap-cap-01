import { seedLessonCards, seedQuestions } from '../src/data/seedData';
import { buildLessonCardNarrationText, buildQuestionNarrationText } from '../src/shared/services/tts/ttsNarration';

const lessonIds = [102, 103, 111, 1083, 1098, 1871];
for (const id of lessonIds) {
  const card = seedLessonCards.find((item) => Number(item.id) === id);
  if (!card) continue;
  console.log(`LESSON ${id}`);
  console.log(buildLessonCardNarrationText(card));
}

const qIds = [2922, 2980, 6116];
for (const id of qIds) {
  const q = seedQuestions.find((item) => Number(item.id) === id);
  if (!q) continue;
  console.log(`QUESTION ${id}`);
  console.log(buildQuestionNarrationText(q));
}
