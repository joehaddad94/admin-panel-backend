export function convertToCamelCase(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCase(item));
  }

  const camelCaseObj: any = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

    if (value instanceof Date) {
      camelCaseObj[camelKey] = value.toISOString();
    } else {
      camelCaseObj[camelKey] = convertToCamelCase(value);
    }
  });
  return camelCaseObj;
}
