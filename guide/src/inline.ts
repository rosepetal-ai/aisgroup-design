/** Inline Markdown used in shared rule strings: **bold** and `code` only. */
export const inline = (text: string) => text
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');
