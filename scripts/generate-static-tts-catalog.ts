import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { letterRounds, countRounds, traceRounds, PRE_GRADE_FEEDBACK_TEXT } from '../src/modules/student/content/preGradeMiniGameRounds';
import { buildLessonCardAssetKey, buildPreGradeFeedbackAssetKey, buildPreGradePromptAssetKey, buildQuestionAssetKey, buildVoiceAuditAssetKey } from '../src/shared/services/tts/ttsAssetKeys';
import { buildLessonCardNarrationText, buildNarrationSsml, buildQuestionNarrationText, VOICE_AUDIT_LINES, type TtsSsmlStyleId } from '../src/shared/services/tts/ttsNarration';
import { getDefaultStaticVoiceProfile, getStaticVoiceProfile, listStaticVoiceProfiles, type StaticTtsVoiceProfile } from '../src/shared/services/tts/ttsVoiceProfiles';
import { seedLessonCards, seedLessons, seedQuestions } from '../src/data/seedData';

type CatalogUsage =
  | 'lesson-read-all'
  | 'practice-on-demand'
  | 'pre-grade-auto'
  | 'feedback-short'
  | 'voice-audit';

interface CatalogEntry {
  key: string;
  kind: 'lesson-card' | 'question' | 'pregrade-prompt' | 'feedback' | 'audit';
  profileId: string;
  voiceId: string;
  lang: 'vi-VN' | 'en-US';
  usage: CatalogUsage;
  styleId: TtsSsmlStyleId;
  text: string;
  ssml: string;
  assetPath: string;
  available: boolean;
  contentVersion: string;
  textHash: string;
}

interface CliOptions {
  contentVersion: string;
  defaultProfileId: string;
}

function parseCliOptions(): CliOptions {
  const contentVersion = process.env.VITE_APP_CONTENT_VERSION || '2026-04-27-v1';
  const defaultProfile = getDefaultStaticVoiceProfile('vi-VN');
  const args = process.argv.slice(2);

  const takeValue = (prefix: string): string | undefined => {
    const direct = args.find((arg) => arg.startsWith(`${prefix}=`));
    if (direct) {
      return direct.slice(prefix.length + 1).trim();
    }
    const index = args.findIndex((arg) => arg === prefix);
    if (index >= 0 && args[index + 1]) {
      return String(args[index + 1]).trim();
    }
    return undefined;
  };

  const defaultProfileId = takeValue('--default-profile') || defaultProfile.id;
  if (!getStaticVoiceProfile(defaultProfileId)) {
    throw new Error(`Unknown static TTS profile "${defaultProfileId}".`);
  }

  return {
    contentVersion: takeValue('--content-version') || contentVersion,
    defaultProfileId,
  };
}

function hashText(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function getLessonLang(subjectCode: string): 'vi-VN' | 'en-US' {
  return subjectCode === 'english' ? 'en-US' : 'vi-VN';
}

function getLessonStyle(subjectCode: string, lang: 'vi-VN' | 'en-US'): TtsSsmlStyleId {
  if (lang === 'en-US') {
    return 'en-general';
  }
  return subjectCode === 'vietnamese' ? 'vi-lesson-reading' : 'vi-lesson-general';
}

function getQuestionStyle(lang: 'vi-VN' | 'en-US'): TtsSsmlStyleId {
  return lang === 'en-US' ? 'en-general' : 'vi-practice';
}

function toAssetPath(profileId: string, fileName: string): string {
  return path.posix.join('audio', 'tts', 'assets', profileId, `${fileName}.mp3`);
}

function makeCatalogEntry(input: {
  key: string;
  kind: CatalogEntry['kind'];
  profile: StaticTtsVoiceProfile;
  usage: CatalogUsage;
  styleId: TtsSsmlStyleId;
  text: string;
  assetPath: string;
  contentVersion: string;
}): CatalogEntry {
  const text = String(input.text || '').trim();
  return {
    key: input.key,
    kind: input.kind,
    profileId: input.profile.id,
    voiceId: input.profile.voiceId,
    lang: input.profile.lang,
    usage: input.usage,
    styleId: input.styleId,
    text,
    ssml: buildNarrationSsml(text, input.profile.lang, input.styleId),
    assetPath: input.assetPath,
    available: existsSync(path.join(process.cwd(), 'public', input.assetPath)),
    contentVersion: input.contentVersion,
    textHash: hashText(text),
  };
}

async function main() {
  const options = parseCliOptions();
  const publicDir = path.join(process.cwd(), 'public', 'audio', 'tts');
  const generatorDir = path.join(process.cwd(), 'backend', 'data', 'tts');
  await mkdir(publicDir, { recursive: true });
  await mkdir(generatorDir, { recursive: true });

  const lessonsById = new Map(seedLessons.map((lesson) => [lesson.id, lesson]));
  const defaultViProfile = getStaticVoiceProfile(options.defaultProfileId) || getDefaultStaticVoiceProfile('vi-VN');
  const defaultEnProfile = getDefaultStaticVoiceProfile('en-US');
  const voiceProfiles = listStaticVoiceProfiles();

  const entries: CatalogEntry[] = [];

  for (const card of seedLessonCards.filter((item) => item.isActive)) {
    const lesson = lessonsById.get(card.lessonId);
    if (!lesson) continue;

    const lang = getLessonLang(lesson.subjectCode);
    const profile = lang === 'vi-VN' ? defaultViProfile : defaultEnProfile;
    entries.push(makeCatalogEntry({
      key: buildLessonCardAssetKey(card.id),
      kind: 'lesson-card',
      profile,
      usage: 'lesson-read-all',
      styleId: getLessonStyle(lesson.subjectCode, lang),
      text: buildLessonCardNarrationText(card),
      assetPath: toAssetPath(profile.id, `lesson-card-${card.id}`),
      contentVersion: options.contentVersion,
    }));
  }

  for (const question of seedQuestions.filter((item) => item.isActive)) {
    const lang = question.subjectCode === 'english' ? 'en-US' : 'vi-VN';
    const profile = lang === 'vi-VN' ? defaultViProfile : defaultEnProfile;
    entries.push(makeCatalogEntry({
      key: buildQuestionAssetKey(question.id),
      kind: 'question',
      profile,
      usage: 'practice-on-demand',
      styleId: getQuestionStyle(lang),
      text: buildQuestionNarrationText(question),
      assetPath: toAssetPath(profile.id, `question-${question.id}`),
      contentVersion: options.contentVersion,
    }));
  }

  letterRounds.forEach((round, index) => {
    entries.push(makeCatalogEntry({
      key: buildPreGradePromptAssetKey('letters', index),
      kind: 'pregrade-prompt',
      profile: defaultViProfile,
      usage: 'pre-grade-auto',
      styleId: 'vi-pregrade',
      text: round.promptSpeech,
      assetPath: toAssetPath(defaultViProfile.id, `pregrade-letters-${index}-prompt`),
      contentVersion: options.contentVersion,
    }));
  });

  countRounds.forEach((round, index) => {
    entries.push(makeCatalogEntry({
      key: buildPreGradePromptAssetKey('counting', index),
      kind: 'pregrade-prompt',
      profile: defaultViProfile,
      usage: 'pre-grade-auto',
      styleId: 'vi-pregrade',
      text: round.promptSpeech,
      assetPath: toAssetPath(defaultViProfile.id, `pregrade-counting-${index}-prompt`),
      contentVersion: options.contentVersion,
    }));
  });

  traceRounds.forEach((round, index) => {
    entries.push(makeCatalogEntry({
      key: buildPreGradePromptAssetKey('tracing', index),
      kind: 'pregrade-prompt',
      profile: defaultViProfile,
      usage: 'pre-grade-auto',
      styleId: 'vi-pregrade',
      text: round.promptSpeech,
      assetPath: toAssetPath(defaultViProfile.id, `pregrade-tracing-${index}-prompt`),
      contentVersion: options.contentVersion,
    }));
  });

  (Object.keys(PRE_GRADE_FEEDBACK_TEXT) as Array<keyof typeof PRE_GRADE_FEEDBACK_TEXT>).forEach((tone) => {
    entries.push(makeCatalogEntry({
      key: buildPreGradeFeedbackAssetKey(tone),
      kind: 'feedback',
      profile: defaultViProfile,
      usage: 'feedback-short',
      styleId: 'vi-feedback',
      text: PRE_GRADE_FEEDBACK_TEXT[tone],
      assetPath: toAssetPath(defaultViProfile.id, `feedback-${tone}`),
      contentVersion: options.contentVersion,
    }));
  });

  const auditEntries = voiceProfiles
    .filter((profile) => profile.lang === 'vi-VN')
    .flatMap((profile) => VOICE_AUDIT_LINES.map((line) => makeCatalogEntry({
      key: buildVoiceAuditAssetKey(profile.id, line.id),
      kind: 'audit',
      profile,
      usage: 'voice-audit',
      styleId: line.styleId,
      text: line.text,
      assetPath: toAssetPath(profile.id, `audit-${profile.id}-${line.id}`),
      contentVersion: options.contentVersion,
    })));

  entries.push(...auditEntries);

  const manifestEntries = Object.fromEntries(entries
    .filter((entry) => entry.available)
    .map((entry) => ([
      entry.key,
      {
        key: entry.key,
        assetPath: entry.assetPath,
        lang: entry.lang,
        usage: entry.usage,
        profileId: entry.profileId,
        contentVersion: entry.contentVersion,
        available: entry.available,
        textHash: entry.textHash,
      },
    ])));

  const byUsage = Array.from(
    entries.reduce((map, entry) => {
      const current = map.get(entry.usage) || { usage: entry.usage, total: 0, available: 0 };
      current.total += 1;
      if (entry.available) {
        current.available += 1;
      }
      map.set(entry.usage, current);
      return map;
    }, new Map<string, { usage: string; total: number; available: number }>()),
  ).map(([, value]) => value);

  const manifest = {
    meta: {
      contentVersion: options.contentVersion,
      generatedAt: new Date().toISOString(),
      defaultProfileId: defaultViProfile.id,
      audioBasePath: 'audio/tts/assets',
    },
    summary: {
      totalEntries: entries.length,
      availableEntries: entries.filter((entry) => entry.available).length,
      missingEntries: entries.filter((entry) => !entry.available).length,
      defaultProfileId: defaultViProfile.id,
      contentVersion: options.contentVersion,
      generatedAt: new Date().toISOString(),
      audioBasePath: 'audio/tts/assets',
      voiceProfiles,
      auditSamples: auditEntries.map((entry) => ({
        key: entry.key,
        label: VOICE_AUDIT_LINES.find((line) => entry.key.endsWith(line.id))?.label || entry.key,
        profileId: entry.profileId,
        sampleId: entry.key.split(':').pop() || '',
        available: entry.available,
      })),
      byUsage,
    },
    entries: manifestEntries,
  };

  const catalog = {
    meta: manifest.meta,
    voiceProfiles,
    entries,
  };

  await writeFile(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  await writeFile(path.join(generatorDir, 'catalog.json'), JSON.stringify(catalog, null, 2), 'utf8');
  await writeFile(path.join(generatorDir, 'voice-audit-lines.json'), JSON.stringify(VOICE_AUDIT_LINES, null, 2), 'utf8');

  console.log(`Generated static TTS catalog: ${entries.length} entries (${manifest.summary.availableEntries} available assets).`);
  console.log(`Default profile: ${defaultViProfile.label} (${defaultViProfile.voiceId})`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
