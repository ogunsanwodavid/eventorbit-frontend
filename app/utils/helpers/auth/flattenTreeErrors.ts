export type ZodErrorTree = {
  errors?: string[]; // make sure this is always string[] instead of unknown[]
  properties?: Record<string, ZodErrorTree>;
};

export type FlatErrors = Record<string, string[]>;

export default function flattenTreeErrors(
  tree: ZodErrorTree,
  parentKey = ""
): FlatErrors {
  let errors: FlatErrors = {};

  if (tree.errors?.length) {
    const key = parentKey || "root";
    errors[key] = tree.errors;
  }

  if (tree.properties) {
    Object.entries(tree.properties).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      errors = {
        ...errors,
        ...flattenTreeErrors(value, newKey),
      };
    });
  }

  return errors;
}
