import HTMLReactParser from "html-react-parser";
import { isString } from "lodash";

export const convertStringToHTML = (input) => {
  // Guard clause to check if the input is undefined or not a string using lodash
  if (!isString(input)) {
    return input;
  }

  // Regular expression to check if the string contains HTML tags
  const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;

  // If the string doesn't contain any HTML tags, return it as-is
  if (!htmlTagPattern.test(input)) {
    return input;
  }

  // Replace empty paragraphs with non-breaking space to preserve spacing
  const adjustedInput = input.replace(/<p><\/p>/g, "<p>&nbsp;</p>");

  // Use HTMLReactParser to parse and return actual HTML elements
  return HTMLReactParser(adjustedInput);
};

// import HTMLReactParser from "html-react-parser";
// import { isString } from "lodash";

// export const parseHtmlString = (htmlString) => {
//   if (!isString(htmlString)) {
//     return "Invalid";
//   }
//   return HTMLReactParser(htmlString);
// };
