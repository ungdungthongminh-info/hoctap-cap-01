import { Request, Response as ExpressResponse } from 'express';

interface GradePackConfig {
  grade: number;
  fileId: string;
  fileName: string;
}

const GRADE_PACKS: GradePackConfig[] = [
  { grade: 0, fileId: '1tPIXTZ50LqgQxhutmvx8QE7IEc8uybTN', fileName: 'vi-v1-grade-0-pre-k.zip' },
  { grade: 1, fileId: '1xhb4KGGklpH9U2Kl0tA1ER8CWSE3czmq', fileName: 'vi-v1-grade-1.zip' },
  { grade: 2, fileId: '1VY-VkQ9Wtunydd10rCCp_Xs9cTZRucyh', fileName: 'vi-v1-grade-2.zip' },
  { grade: 3, fileId: '1LKgjUtADcVkbDpvCkfzSNCdNoJG94YQv', fileName: 'vi-v1-grade-3.zip' },
  { grade: 4, fileId: '164Xxc7vlATmrBqSHd9EWSXnvk9Q37rFk', fileName: 'vi-v1-grade-4.zip' },
  { grade: 5, fileId: '1PinMxVGHSl-GkekhSvTYp5rLgmcUFOQV', fileName: 'vi-v1-grade-5.zip' },
  { grade: 6, fileId: '1tPIXTZ50LqgQxhutmvx8QE7IEc8uybTN', fileName: 'vi-v1-grade-6.zip' },
];

function normalizeGrade(value: string): number | null {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return null;

  if (raw === 'pre-k' || raw === 'prek' || raw === 'pre_k' || raw === '0') {
    return 0;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function findPackByGrade(gradeRaw: string): GradePackConfig | null {
  const grade = normalizeGrade(gradeRaw);
  if (grade === null) return null;
  return GRADE_PACKS.find((item) => item.grade === grade) || null;
}

async function fetchDrivePack(fileId: string): Promise<globalThis.Response> {
  const candidates = [
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`,
  ];

  let lastResponse: globalThis.Response | null = null;
  for (const url of candidates) {
    const response = await fetch(url, { redirect: 'follow' });
    if (response.ok) {
      return response;
    }
    lastResponse = response;
  }

  if (lastResponse) {
    throw new Error(`Drive HTTP ${lastResponse.status}`);
  }
  throw new Error('Drive fetch failed');
}

export async function getStaticPackByGradeHandler(req: Request, res: ExpressResponse) {
  const pack = findPackByGrade(String(req.params.grade || ''));
  if (!pack) {
    return res.status(400).json({
      success: false,
      error: 'Invalid grade. Use 0..6 or pre-k.',
    });
  }

  try {
    const driveResponse = await fetchDrivePack(pack.fileId);
    const contentType = driveResponse.headers.get('content-type') || 'application/zip';
    const contentLength = driveResponse.headers.get('content-length');
    const arrayBuffer = await driveResponse.arrayBuffer();

    if (!arrayBuffer.byteLength) {
      return res.status(502).json({
        success: false,
        error: 'Drive returned empty file.',
      });
    }

    res.setHeader('Content-Type', contentType);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    res.setHeader('Content-Disposition', `attachment; filename="${pack.fileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    return res.status(502).json({
      success: false,
      error: `Cannot fetch static pack from Drive for grade ${pack.grade}.`,
      details: String(error?.message || 'Unknown error'),
    });
  }
}
