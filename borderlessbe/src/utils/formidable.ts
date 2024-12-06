import formidable from "formidable";
import { IncomingMessage } from "http";

/**
 * Parses a form from an HTTP request using Formidable.
 * @param req - The HTTP request object
 * @returns A promise that resolves to an object containing `fields` and `files`
 */
export const parseForm = (
  req: IncomingMessage
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};
