// Markify is a stateless calculator application - no storage operations needed
// Storage interface kept for future extensibility

export interface IStorage {
  // Future storage operations can be added here
}

export class MemStorage implements IStorage {
  constructor() {
    // No initialization needed for stateless calculator
  }
}

export const storage = new MemStorage();
