'use server';

import { generateSecureAccessCode as genkitGenerateSecureAccessCode, type SecureAccessCodeInput, type SecureAccessCodeOutput } from '@/ai/flows/secure-access-code-generation';

// This server action is a wrapper around the Genkit flow.
// It can be called from client components.
export async function generateSecureAccessCodeAction(input: SecureAccessCodeInput): Promise<SecureAccessCodeOutput> {
  try {
    const result = await genkitGenerateSecureAccessCode(input);
    if (!result || !result.accessCode) {
      throw new Error("Access code generation failed or returned an empty code.");
    }
    return result;
  } catch (error) {
    console.error("Error in generateSecureAccessCodeAction:", error);
    // It's better to throw a more specific error or handle it as per application needs
    throw new Error(`Failed to generate secure access code: ${(error as Error).message}`);
  }
}
