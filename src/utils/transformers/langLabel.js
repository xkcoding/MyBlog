/**
 * Shiki transformer that adds data-lang attribute to code blocks.
 * The actual label is added via JavaScript in PostDetails.astro.
 */
export const transformerLangLabel = () => ({
  pre(node) {
    const lang = this.options.lang;
    if (!lang || lang === "plaintext" || lang === "text") return;

    const raw = this.options.meta?.__raw?.split(" ") || [];
    const hasFile = raw.some(item => item.startsWith("file="));
    if (hasFile) return;

    // Only add data-lang attribute, JavaScript will handle the label
    node.properties = node.properties || {};
    node.properties["data-lang"] = lang;
  },
});
