import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildPrompt, guardrails } from '@/lib/safety';
import { ImageRequest, ImageResponse } from '@/lib/types';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<ImageRequest>;
  const scene = {
    location: body.location ?? '',
    year: body.year ?? '',
    people: body.people ?? '',
    objects: body.objects ?? '',
    mood: body.mood ?? '',
    style: body.style ?? '',
    student: body.studentNote ?? ''
  };

  const strictness = (body as any)?.strictness === 'creative' ? 'creative' : 'conservative';
  const description = Object.values(scene).join(' ');
  const safetyCheck = guardrails(description);

  if (!safetyCheck.allowed) {
    return NextResponse.json<ImageResponse>(
      {
        imageUrl: '',
        revisedPrompt: '',
        safetyNotes: safetyCheck.message,
        error: 'Blocked for safety'
      },
      { status: 400 }
    );
  }

  const prompt = buildPrompt({ scene, eventTitle: body.eventTitle ?? 'Historical moment', strictness });

  if (!openai) {
    return NextResponse.json<ImageResponse>({
      imageUrl: 'https://placehold.co/800x600/png?text=Enable+OPENAI_API_KEY+for+live+images',
      revisedPrompt: prompt,
      safetyNotes: 'Using placeholder image because OPENAI_API_KEY is not set.'
    });
  }

  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      size: '1024x1024',
      prompt
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) throw new Error('No image URL returned');

    return NextResponse.json<ImageResponse>({
      imageUrl,
      revisedPrompt: prompt,
      safetyNotes: 'Caption visuals as illustrative; avoid assuming exact accuracy.'
    });
  } catch (error) {
    return NextResponse.json<ImageResponse>(
      {
        imageUrl: 'https://placehold.co/800x600/png?text=Image+temporarily+unavailable',
        revisedPrompt: prompt,
        safetyNotes: 'Falling back to placeholder due to a generation issue.'
      },
      { status: 200 }
    );
  }
}
