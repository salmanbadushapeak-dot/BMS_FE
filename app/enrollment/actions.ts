"use server";

export async function createStudent(data: any) {
  // Static mode - return success (data won't persist until backend is connected)
  return [{ id: Date.now().toString(), ...data }];
}

