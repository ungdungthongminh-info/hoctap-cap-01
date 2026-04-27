import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';

export interface GoogleTtsSynthesizeInput {
  text?: string;
  ssml?: string;
  lang: string;
  voiceId: string;
  speed: number;
  pitch?: number;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeAudioEncoding(value: string | undefined) {
  const raw = String(value || 'MP3').trim().toUpperCase();
  return raw === 'LINEAR16'
    ? protos.google.cloud.texttospeech.v1.AudioEncoding.LINEAR16
    : protos.google.cloud.texttospeech.v1.AudioEncoding.MP3;
}

function toAudioBuffer(audioContent: Uint8Array | string | null | undefined): Buffer {
  if (!audioContent) {
    throw new Error('Google Cloud TTS did not return audio content.');
  }

  if (typeof audioContent === 'string') {
    return Buffer.from(audioContent, 'base64');
  }

  return Buffer.from(audioContent);
}

export class GoogleTtsAdapter {
  private client: TextToSpeechClient | null = null;

  get provider(): 'google-cloud' {
    return 'google-cloud';
  }

  get defaultLanguage(): string {
    return String(process.env.GOOGLE_TTS_DEFAULT_LANGUAGE || 'vi-VN').trim() || 'vi-VN';
  }

  get defaultVoice(): string {
    return String(process.env.GOOGLE_TTS_DEFAULT_VOICE || 'vi-VN-Wavenet-A').trim() || 'vi-VN-Wavenet-A';
  }

  get maxTextLength(): number {
    return parsePositiveInt(process.env.TTS_MAX_TEXT_LENGTH, 1800);
  }

  private getClient(): TextToSpeechClient {
    if (!this.client) {
      this.client = new TextToSpeechClient();
    }

    return this.client;
  }

  validateText(text: string): void {
    const normalized = String(text || '').trim();
    if (!normalized) {
      throw new Error('Text is required.');
    }

    if (normalized.length > this.maxTextLength) {
      throw new Error(`Text exceeds TTS_MAX_TEXT_LENGTH (${this.maxTextLength}).`);
    }
  }

  validateVoiceId(voiceId: string): void {
    const safe = String(voiceId || '').trim();
    if (!safe) {
      throw new Error('voiceId is required.');
    }

    if (!/^[A-Za-z0-9._-]+$/.test(safe)) {
      throw new Error('voiceId contains unsupported characters.');
    }
  }

  async synthesize(input: GoogleTtsSynthesizeInput): Promise<Buffer> {
    const text = String(input.text || '').trim();
    const ssml = String(input.ssml || '').trim();
    const lang = String(input.lang || this.defaultLanguage).trim() || this.defaultLanguage;
    const voiceId = String(input.voiceId || this.defaultVoice).trim() || this.defaultVoice;
    const speed = Number.isFinite(input.speed) ? input.speed : 1;
    const pitch = Number.isFinite(input.pitch) ? Number(input.pitch) : 0;

    if (!text && !ssml) {
      throw new Error('Either text or ssml is required.');
    }

    this.validateText(ssml ? ssml.replace(/<[^>]+>/g, ' ') : text);
    this.validateVoiceId(voiceId);

    const [response] = await this.getClient().synthesizeSpeech({
      input: ssml ? { ssml } : { text },
      voice: {
        languageCode: lang,
        name: voiceId,
      },
      audioConfig: {
        audioEncoding: normalizeAudioEncoding(process.env.GOOGLE_TTS_AUDIO_ENCODING),
        speakingRate: speed,
        pitch,
      },
    });

    return toAudioBuffer(response.audioContent);
  }
}

export default new GoogleTtsAdapter();
