// Illustrative indexed side-rejection example. Hardware, cycle time and dimensions illustrate the proposed sequence.
export default {
  title: ["Carton", "rejection"],
  sceneDescription: "A guided pusher diverts carton C18 onto a receiving tray after a failed barcode read. C17 stays on the belt.",
  transport: "indexing",
  reject: "side-pusher",
  product: { name: "Carton", construction: "taped-carton" },
  items: [
    { id: "C17", readable: true },
    { id: "C18", readable: false },
  ],
  chapters: ["Overview", "Good read", "Failed read", "Side transfer"],
  captions: [
    "Two cartons enter the reader.",
    "The reader faces the printed code.",
    "C17 reads correctly.",
    "C18 reaches the same reader.",
    "A gap breaks the barcode on C18.",
    "C18 reaches the side pusher.",
    "The pad pushes C18 onto the tray.",
    "C18 stays on the tray as the pad returns.",
  ],
};
