// Simple database module that provides both sql and db exports
export const sql = async (query: string, params: any[] = []) => {
  console.log("SQL query:", query, params)
  return [] // Return empty array as fallback
}

export const db = {
  query: async (text: string, params: any[] = []) => {
    console.log("DB query:", text, params)
    return { rows: [] } // Return empty rows as fallback
  },
}
