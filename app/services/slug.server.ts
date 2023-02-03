import { nanoid } from "nanoid";
import slugify from "slugify";

export function slug(name: string) {
  return (
    slugify(name, {
      lower: true,
    }) +
    "-" +
    nanoid(5)
  );
}
