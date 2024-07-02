export function convertToCamelCase(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCase(item));
  }

  const camelCaseObj: any = {};
  Object.keys(obj).forEach((key) => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    camelCaseObj[camelKey] = convertToCamelCase(obj[key]);
  });
  return camelCaseObj;
}
