"use server";

export async function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}
