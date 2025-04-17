export interface VueOptions {
  lastNameUpperCase?: boolean;
}

export function vue(firstName: string, lastName: string, options?: VueOptions) {
  if (options?.lastNameUpperCase) {
    return `${firstName} ${lastName.toLocaleUpperCase()}`;
  }
  return `${firstName} ${lastName}`;
}
