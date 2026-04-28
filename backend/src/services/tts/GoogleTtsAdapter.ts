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

function normalizeAudioEncodingName(value: string | undefined): 'MP3' | 'LINEAR16' {
  const raw = String(value || 'MP3').trim().toUpperCase();
  return raw === 'LINEAR16' ? 'LINEAR16' : 'MP3';
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
    return String(process.env.GOOGLE_TTS_DEFAULT_VOICE || 'vi-VN-Chirp3-HD-Despina').trim() || 'vi-VN-Chirp3-HD-Despina';
  }

  get apiKey(): string {
    return String(process.env.GOOGLE_TTS_API_KEY || '').trim();
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

  private async synthesizeViaApiKey(input: {
    text?: string;
    ssml?: string;
    lang: string;
    voiceId: string;
    speed: number;
    pitch: number;
  }): Promise<Buffer> {
    const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(this.apiKey)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input.ssml ? { ssml: input.ssml } : { text: input.text || '' },
        voice: {
          languageCode: input.lang,
          name: input.voiceId,
        },
        audioConfig: {
          audioEncoding: normalizeAudioEncodingName(process.env.GOOGLE_TTS_AUDIO_ENCODING),
          speakingRate: input.speed,
          pitch: input.pitch,
        },
      }),
    });

    const payload: any = await response.json().catch(() => ({} as Record<string, unknown>));
    if (!response.ok) {
      const message = String(payload?.error?.message || `Google TTS REST failed with HTTP ${response.status}.`);
      throw new Error(message);
    }

    return toAudioBuffer(payload?.audioContent);
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

    if (this.apiKey) {
      return this.synthesizeViaApiKey({
        text,
        ssml,
        lang,
        voiceId,
        speed,
        pitch,
      });
    }

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
