'use client';

import { useState } from 'react';
import { Sparkles, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STYLE_PRESETS } from '@/config/styles';
import { StylePreset } from '@/types';

interface StyleSelectionProps {
  onStyleSelect: (prompt: string, styleName: string) => void;
  disabled?: boolean;
}

export function StyleSelection({ onStyleSelect, disabled = false }: StyleSelectionProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handlePresetSelect = (preset: StylePreset) => {
    setSelectedPreset(preset.id);
    setShowCustomInput(false);
    onStyleSelect(preset.prompt, preset.label);
  };

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      setSelectedPreset(null);
      onStyleSelect(customPrompt.trim(), 'Custom Style');
    }
  };

  const handleShowCustomInput = () => {
    setShowCustomInput(true);
    setSelectedPreset(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Style</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a preset style or create your own custom transformation
        </p>
      </div>

      {/* Preset Styles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STYLE_PRESETS.map((preset) => (
          <Card
            key={preset.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPreset === preset.id
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:border-primary/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && handlePresetSelect(preset)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-primary" />
                {preset.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{preset.description}</CardDescription>
            </CardContent>
          </Card>
        ))}

        {/* Custom Style Card */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            showCustomInput
              ? 'ring-2 ring-primary shadow-lg'
              : 'hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && handleShowCustomInput()}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Edit3 className="w-5 h-5 text-primary" />
              Custom Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Write your own detailed transformation prompt
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Custom Prompt Input */}
      {showCustomInput && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Custom Transformation Prompt</CardTitle>
            <CardDescription>
              Describe how you want to transform your photo. Be as detailed as possible for best results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-prompt">Your Custom Prompt</Label>
              <Input
                id="custom-prompt"
                placeholder="e.g., Transform this photo into a magical winter wonderland with snow falling, aurora borealis in the sky, and a cozy cabin with warm lights..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                disabled={disabled}
                className="min-h-[100px]"
                aria-label="Custom transformation prompt"
              />
            </div>
            <Button
              onClick={handleCustomSubmit}
              disabled={!customPrompt.trim() || disabled}
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Apply Custom Style
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Helpful Tips */}
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200">
        <p className="font-medium mb-2">💡 Tips for best results:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300">
          <li>Preset styles have been optimized for great results</li>
          <li>For custom prompts, be specific and detailed</li>
          <li>Mention desired lighting, colors, and mood</li>
          <li>Processing may take 10-30 seconds</li>
        </ul>
      </div>
    </div>
  );
}


