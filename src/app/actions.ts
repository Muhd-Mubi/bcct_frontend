'use server';

import { predictReorderingSchedule, PredictiveReorderingInput } from '@/ai/flows/predictive-reordering';
import { initialMaterials } from '@/lib/data'; // Using this as dummy historical data

export async function getReorderingSuggestion(selectedMaterialNames: string[]) {
    // In a real app, you would fetch historical data from a database.
    // For this demo, we'll use our mock data as a string representation of historical data.
    const inventoryData = JSON.stringify(initialMaterials, null, 2);

    const input: PredictiveReorderingInput = {
        inventoryData,
        materials: selectedMaterialNames,
    };

    try {
        const result = await predictReorderingSchedule(input);
        return { success: true, schedule: JSON.parse(result.reorderingSchedule) };
    } catch (error) {
        console.error("Error getting reordering suggestion:", error);
        // This can happen if the AI model doesn't return valid JSON.
        if (error instanceof SyntaxError) {
             return { success: false, error: "AI returned an invalid format. Please try again." };
        }
        return { success: false, error: "Failed to generate suggestion." };
    }
}
