"use server"

import { getAdditionalOptions } from "./additional-option-actions"

export async function fetchAdditionalOptionsData() {
  return await getAdditionalOptions()
}
