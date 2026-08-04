import TiptapImage from "@tiptap/extension-image";

/**
 * Extend TiptapImage bawaan biar bisa nyimpen `width` (persentase) dan
 * `align` (left/center/right) per gambar — dikontrol dari tab "Blok" di
 * sidebar editor, mirip pengaturan blok gambar di WordPress.
 */
const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.style.width || element.getAttribute("width") || "100%",
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}`,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => {
          const alignStyle =
            attributes.align === "left"
              ? "margin-left: 0; margin-right: auto;"
              : attributes.align === "right"
              ? "margin-left: auto; margin-right: 0;"
              : "margin-left: auto; margin-right: auto;"; // center
          return {
            "data-align": attributes.align,
            style: `width: ${attributes.width}; display: block; ${alignStyle}`,
          };
        },
      },
    };
  },
});

export default CustomImage;