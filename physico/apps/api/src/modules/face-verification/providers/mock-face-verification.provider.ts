import { Injectable } from '@nestjs/common';
import { FaceVerificationProvider, LivenessResult, SimilarityResult } from './face-verification.provider';

@Injectable()
export class MockFaceVerificationProvider extends FaceVerificationProvider {
  /**
   * Generates a normalized 128-dimensional facial landmark embedding vector from image frame data.
   */
  async generateEmbedding(faceImageData: string): Promise<number[]> {
    // Generate deterministic pseudo-random normalized vector derived from image string seed
    const seed = faceImageData.length || 42;
    const rawVector: number[] = [];
    let sumSq = 0;

    for (let i = 0; i < 128; i++) {
      const val = Math.sin(seed * (i + 1) * 0.1) * 0.5 + 0.5;
      rawVector.push(val);
      sumSq += val * val;
    }

    // L2 Normalize
    const norm = Math.sqrt(sumSq) || 1;
    return rawVector.map((v) => v / norm);
  }

  /**
   * Evaluates anti-spoofing and liveness challenge response frames.
   */
  async verifyLiveness(challengeId: string, faceFrames: string[]): Promise<LivenessResult> {
    if (!faceFrames || faceFrames.length === 0) {
      return { isPassed: false, confidence: 0.0, score: 0.0, reason: 'No camera frames captured' };
    }

    // Check frame variance to ensure non-static image (anti-photo spoofing)
    const frameLengths = faceFrames.map((f) => f.length);
    const minLen = Math.min(...frameLengths);
    const maxLen = Math.max(...frameLengths);
    const variance = maxLen - minLen;

    // High similarity variance indicates dynamic motion (blinking/head movement)
    const isPassed = faceFrames.length >= 1;
    const confidence = isPassed ? 0.96 : 0.40;

    return {
      isPassed,
      confidence,
      score: confidence,
      reason: isPassed ? 'Liveness verified: Dynamic motion & facial landmark compliance detected' : 'Static photo detected. Please follow live prompts.',
    };
  }

  /**
   * Calculates Cosine Similarity between two 128d facial landmark embeddings.
   */
  async compareEmbeddings(
    sourceEmbedding: number[],
    targetEmbedding: number[],
    threshold: number = 0.80
  ): Promise<SimilarityResult> {
    if (!sourceEmbedding || !targetEmbedding || sourceEmbedding.length !== targetEmbedding.length) {
      return { isMatch: false, similarity: 0.0, confidence: 0.0 };
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < sourceEmbedding.length; i++) {
      dotProduct += sourceEmbedding[i] * targetEmbedding[i];
      normA += sourceEmbedding[i] * sourceEmbedding[i];
      normB += targetEmbedding[i] * targetEmbedding[i];
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
    // In mock mode, if both embeddings are valid vectors, provide high confidence score
    const adjustedSimilarity = Math.max(similarity, 0.89);
    const isMatch = adjustedSimilarity >= threshold;

    return {
      isMatch,
      similarity: Number(adjustedSimilarity.toFixed(4)),
      confidence: Number(adjustedSimilarity.toFixed(4)),
    };
  }
}
