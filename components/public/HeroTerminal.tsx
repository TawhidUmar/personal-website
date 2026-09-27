'use client';

import { useState } from 'react';
import { Terminal, Copy, Check, Cpu, Activity, Play } from 'lucide-react';

const tabs = [
  {
    id: 'research',
    filename: 'selective_ssm.py',
    language: 'Python',
    code: `import torch
import torch.nn as nn
from triton_kernels import selective_scan_fused

class SelectiveStateSpaceBlock(nn.Module):
    """
    Hardware-fused Selective State-Space sequence model.
    Linear complexity O(N) over long-context sequence reasoning.
    """
    def __init__(self, d_model: int = 1024, d_state: int = 64):
        super().__init__()
        self.d_model = d_model
        self.d_state = d_state
        self.in_proj = nn.Linear(d_model, d_model * 2, bias=False)
        self.x_proj = nn.Linear(d_model, d_state * 2 + 1, bias=False)
        self.dt_proj = nn.Linear(1, d_model, bias=True)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)

    def forward(self, u: torch.Tensor) -> torch.Tensor:
        # u: [batch, seq_len, d_model]
        batch, seq_len, _ = u.shape
        x, z = self.in_proj(u).chunk(2, dim=-1)
        
        # Continuous parameter discretization
        delta_A_B = self.x_proj(x)
        y = selective_scan_fused(x, delta_A_B, self.d_state)
        return self.out_proj(y * nn.functional.silu(z))`,
  },
  {
    id: 'architecture',
    filename: 'inference_pipeline.ts',
    language: 'TypeScript',
    code: `import { createTensorEngine } from '@neural/tensor-core';
import type { ModelConfig, InferencePipeline } from '@/types/runtime';

export async function bootstrapResearchEngine(
  config: ModelConfig
): Promise<InferencePipeline> {
  const runtime = await createTensorEngine({
    precision: 'fp16',
    kvCacheQuantization: 'int4_group128',
    maxBatchSize: 32,
    enableCUDAKernels: true,
  });

  runtime.on('telemetry', (metrics) => {
    console.log(\`[Throughput] \${metrics.tokensPerSec.toFixed(1)} tok/s | Latency: \${metrics.ttftMs}ms\`);
  });

  return runtime.initializePipeline(config);
}`,
  },
  {
    id: 'telemetry',
    filename: 'metrics.json',
    language: 'JSON',
    code: `{
  "benchmark": "Long Range Arena (LRA 64k)",
  "status": "CONVERGED",
  "accuracy": {
    "listops": "0.642",
    "text_classification": "0.891",
    "retrieval": "0.914",
    "pathfinder": "0.948"
  },
  "hardware_profile": {
    "device": "NVIDIA RTX 4090 (24GB VRAM)",
    "peak_memory_mb": 4210.5,
    "memory_savings": "3.8x vs Transformer",
    "latency_per_token_ms": 2.41
  }
}`,
  },
];

export function HeroTerminal() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl transition-all duration-200">
      {/* Top terminal bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 font-mono text-xs text-[var(--color-muted)] flex items-center gap-1.5">
            <Terminal size={13} className="text-[var(--color-accent)]" />
            research-workspace
          </span>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {tab.filename}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)] transition-colors"
        >
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code window */}
      <div className="relative overflow-x-auto p-4 sm:p-5 font-mono text-xs leading-relaxed text-[var(--color-foreground)] max-h-[380px] bg-[var(--color-background)]/80">
        <pre className="selection:bg-[var(--color-accent-subtle)] selection:text-[var(--color-accent)]">
          <code>{currentTab.code}</code>
        </pre>
      </div>

      {/* Terminal footer status bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface-raised)]/60 px-4 py-2 font-mono text-[11px] text-[var(--color-muted)]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Cpu size={12} className="text-[var(--color-accent)]" />
            CUDA v12.4
          </span>
          <span className="flex items-center gap-1.5">
            <Activity size={12} className="text-green-500" />
            Memory: 4.2 GB / 24 GB
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Inference Engine: Ready</span>
        </div>
      </div>
    </div>
  );
}
