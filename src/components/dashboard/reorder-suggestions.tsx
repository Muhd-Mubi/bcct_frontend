'use client';

import React, { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { getReorderingSuggestion } from '@/app/actions';
import { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ReorderSuggestionsProps {
  materials: Material[];
}

export function ReorderSuggestions({ materials }: ReorderSuggestionsProps) {
  const [isPending, startTransition] = useTransition();
  const [suggestion, setSuggestion] = useState<any>(null);
  const { toast } = useToast();
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const handleCheckboxChange = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };
  
  const lowStockMaterials = materials.filter(
    (m) => (m.currentStock / m.maxStock) * 100 < m.reorderThreshold + 10
  );

  const handleGenerate = () => {
    if (selectedMaterials.length === 0) {
      toast({
        title: 'No materials selected',
        description: 'Please select at least one material to generate a suggestion.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await getReorderingSuggestion(selectedMaterials);
      if (result.success) {
        setSuggestion(result.schedule);
        toast({
          title: 'Suggestion Generated',
          description: 'AI-powered reordering schedule is ready.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit className="size-5" />
          Predictive Reordering
        </CardTitle>
        <CardDescription>AI-powered reorder suggestions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestion ? (
          <div className="space-y-2 text-sm p-3 bg-muted rounded-md">
            <h4 className="font-semibold">Suggested Schedule:</h4>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(suggestion, null, 2)}
            </pre>
            <Button size="sm" variant="ghost" onClick={() => setSuggestion(null)}>
              Generate New
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
                <p className="text-sm font-medium">Select materials for suggestion:</p>
                <div className="space-y-1">
                {lowStockMaterials.map(material => (
                    <div key={material.id} className="flex items-center space-x-2">
                        <Checkbox id={material.id} onCheckedChange={() => handleCheckboxChange(material.id)} />
                        <Label htmlFor={material.id} className="text-sm font-normal">{material.name}</Label>
                    </div>
                ))}
                </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isPending || selectedMaterials.length === 0}
              className="w-full"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Suggestion
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
