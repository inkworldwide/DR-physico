export interface LivenessResult {
  isPassed: boolean;
  confidence: number;
  score: number;
  reason?: string;
}

export interface SimilarityResult {
  isMatch: boolean;
  similarity: number;
  confidence: number;
}

export abstract class FaceVerificationProvider {
  abstract generateEmbedding(faceImageData: string): Promise<number[]>;
  abstract verifyLiveness(challengeId: string, faceFrames: string[]): Promise<LivenessResult>;
  abstract compareEmbeddings(
    sourceEmbedding: number[],
    targetEmbedding: number[],
    threshold: number
  ): Promise<SimilarityResult>;
}
