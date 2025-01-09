// src/index.js (Main entry point)

import { MLCEngineWrapper } from '@/engines/mlc-engine-wrapper';
import { TransformersEngineWrapper } from '@/engines/transformer-engine-wrapper';
import { ModelConfig, MLCConfig, TransformersConfig } from '@/config/models/types';
import mlcModels from '@/config/models/mlc-models.json';
import transformersModels from '@/config/models/transformers-models.json';

// Combine model configurations
const MODEL_CONFIG: Record<string, ModelConfig> = {
  ...mlcModels as Record<string, MLCConfig>,
  ...transformersModels as Record<string, TransformersConfig>
};

export class BrowserAI {
  private engine: MLCEngineWrapper | TransformersEngineWrapper | null;
  public currentModel: ModelConfig | null;

  constructor() {
    this.engine = null;
    this.currentModel = null;
  }

  async loadModel(modelIdentifier: string, options: Record<string, unknown> = {}): Promise<void> {
    const modelConfig = MODEL_CONFIG[modelIdentifier];

    if (!modelConfig) {
      throw new Error(`Model identifier "${modelIdentifier}" not recognized.`);
    }

    const { engine: engineType } = modelConfig;

    switch (engineType) {
      case "mlc":
        this.engine = new MLCEngineWrapper();
        await this.engine.loadModel(modelConfig, options);
        break;
      case "transformers":
        this.engine = new TransformersEngineWrapper();
        await this.engine.loadModel(modelConfig, options);
        break;
      default:
        throw new Error(`Engine "${engineType}" not supported.`);
    }

    this.currentModel = modelConfig;
  }


  async generateText(prompt: string, options: Record<string, unknown> = {}): Promise<unknown> {
    if (!this.engine) {
      throw new Error("No model loaded. Please call loadModel first.");
    }

    try {
      const result = await this.engine.generateText(prompt, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async transcribeAudio(audio: Blob, options: Record<string, unknown> = {}): Promise<unknown> {
    if (!this.engine) {
      throw new Error("No model loaded. Please call loadModel first.");
    }

    try {
      if (this.engine instanceof TransformersEngineWrapper) {
        const transcribedResults = await this.engine.transcribe(audio, options);
        return transcribedResults;
      } else {
        throw new Error("Engine does not support transcribe method.");
      }
    } catch (error) {
      throw error;
    }
  }
}